import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import _, {pick, pickBy, includes, size, mapValues, keys, each, assign, isEqual, omitBy, isFunction} from 'lodash'

// higher-order component to provide basic connection to redux-stored component goodies for channels,
// like errors, loading state, resulting data, etc.
export function asyncify(Component, componentId, channels = {}){
  // build-in system-wide channel defaults from the beginning, and wrap the load function
  // to thunkify it
  // TODO: make this a separate, testable lil' function
  const initialChannels = mapValues(channels, (channel, id) => {
    // add id references before passing to thunkifyAndWrap, which assumes a fully formed channel
    const newChannel = assign({}, defaultChannel, channel, {id, componentId})
    newChannel.load = thunkifyAndWrap(channel.load, newChannel)
    return newChannel
  })
  // convenience, so we don't have to keep calling keys
  const channelIds = keys(initialChannels)

  const wrapper = React.createClass({

    propTypes: {
      dispatch: PropTypes.func.isRequired
    },

    // gets current channels from props, all updated and such. props channels contain
    // current settings, data, and such. the channels outside the component scope
    // are just the user-passed channel configuration
    channels(){
      return channelIds.map(chid => this.props[chid])
    },

    componentWillMount(){
      this.props.dispatch(mountComponent(this.channels()))
      _(this.channels()).filter(ch => ch.onLoad).each(ch => {
        ch.load(ch.settings)
      })
    },

    componentWillUnmount(){
      this.props.dispatch(unmountComponent(componentId))
    },

    channelShouldLoad(ch, before){
      return ch.onChange && !isEqual(before[ch.id].settings, ch.settings)
    },

    componentDidUpdate(prev){
      _(this.channels()).filter(ch => this.channelShouldLoad(ch, prev)).each(ch => {
        ch.load(ch.settings)
      })
    },

    render(){
      return <Component {...this.props} />
    }
  })

  function mapStateToProps(state){
    const component = Object.assign({}, state.components[componentId])
    const props = {componentId}

    // over-ride defaults with what's in the state
    each(initialChannels, channel => {
      const stateChannel = component[channel.id]
      props[channel.id] = Object.assign({}, channel, stateChannel)
    })

    // TODO: add some global things, like isAnyLoading, isAnyErrors, etc.?

    return props
  }

  function mapDispatchToProps(dispatch){
    const props = {dispatch}
    // make sure to just make objects with the functions as keys, and not to modify the original
    // object by reference.
    // mapStateToProps handles the other keys, so no need for those.
    // And modifying the object by reference on the original channel object would mean
    // we'd keep wrapping over and over again
    // TODO: look into the version of mapDispatchToProps that returns a function. the docs claim
    // we can memoize, which would be nice, so we don't have to keep function wrapping?
    each(initialChannels, channel => {
      props[channel.id] = {
        load: (...args) => dispatch(channel.load(...args)),
        setSettings: (settings) => dispatch(setSettings(channel, settings))
      }
    })
    return props
  }

  function mergeProps(state, dispatch, own){
    // we need to pull core info (loading, errors, etc.) from state
    // and we need to give dispatch props preference over those for functions, so we get the
    // dispatch-wrapped functions
    const mergedChannels = {}
    each(channelIds, channelId => {
      // give dispatch the preference within the channel, so we over-ride the original load
      // also, we're assigning to mergedChannels because I ran into a bug that caused changes here
      // to the dispatch object to stick around? there be strange beasties afoot
      mergedChannels[channelId] = assign({}, state[channelId], dispatch[channelId])
    })

    // now return the normal merge operations, just with mergedChannels tacked on to take care
    // of the channel props
    return assign({}, own, state, dispatch, mergedChannels)
  }

  return connect(mapStateToProps, mapDispatchToProps, mergeProps)(wrapper)
}

const defaultChannel = {
  loading: false,
  //error, leaving error undefined so we can do nice if(!ch.error) stuffs
  //same with data and settings
  onLoad: false,
  onChange: false
  // settingsToQueryString undefined
}


// take a promise-returning function. return a thunk that wraps that promise with loading/error
// logic, but provides the same interface (just passes args onto the child function).
// whatever data is returned by the promise is set to data when the promise resolves, and the same
// goes for errors
export function thunkifyAndWrap(func, channel){
  return (...args) => {
    return dispatch => {
      dispatch(loadStart(channel))
      return func(...args)
        .then(response => {
          dispatch(loadSuccess(channel, response))
          return response
        })
        .catch(error => {
          dispatch(loadError(channel, error))
          return error
        })
    }
  }
}

function mountComponent(channels){
  return { type: 'COMPONENT_MOUNT', channels }
}

function unmountComponent(componentId){
  return { type: 'COMPONENT_UNMOUNT', componentId }
}

function setSettings(channel, settings){
  return { type: 'COMPONENT_SETTINGS', channel, settings }
}

function loadStart(channel){
  return { type: 'COMPONENT_LOAD_START', channel }
}

function loadError(channel, error){
  return { type: "COMPONENT_LOAD_ERROR", channel, error }
}

function loadSuccess(channel, data){
  return { type: "COMPONENT_LOAD_SUCCESS", channel, data }
}

// merge is an object of values merged into the channel. this reducer should be applied
// to the 'components' key in the state. The whole structure is:
// {
//  'components' : {
//    [componentId] : {
//      [channelId] : {
//        loading: true|false,
//        error: ...,
//        data: ...,
//        settings: ...
//      }
//    }
//  }
// }
function reducerSet(state, channel, merge){
  const { componentId, id: channelId } = channel

  // merge the values from the action into the channel, all immutable like
  const component = state[componentId] || {}
  const mergedComponent = assign({}, component, {
    [channelId] : assign({}, component[channelId] || {}, merge)
  })

  return Object.assign({}, state, {
    [componentId]: mergedComponent
  })
}

function destroyComponent(state, componentId){
  const newState = assign({}, state)
  delete newState[componentId]
  return newState
}

// just remove non-serializable data
function toStateChannel(channel){
  return omitBy(channel, isFunction)
}

export function reducer(state = {}, action) {
  switch (action.type) {
  case 'COMPONENT_MOUNT':
    each(action.channels, channel => {
      // merge in initial values. need to filter out garbage in case the channel
      // is prop-ified, with stuff like load/setSettings
      state = reducerSet(state, channel, toStateChannel(channel))
    })
    return state
  case 'COMPONENT_UNMOUNT':
    return destroyComponent(state, action.componentId)
  case 'COMPONENT_LOAD_START':
    return reducerSet(state, action.channel, {data: undefined, loading: true, error: undefined})
  case 'COMPONENT_LOAD_ERROR':
    return reducerSet(state, action.channel, {data: undefined, loading: false, error: action.error})
  case 'COMPONENT_LOAD_SUCCESS':
    return reducerSet(state, action.channel, {data: action.data, loading: false, error: undefined})
  case 'COMPONENT_SETTINGS':
    return reducerSet(state, action.channel, {settings: action.settings})
  }
  return state
}

// pass this function a push function, and it'll return middleware for refux that calls that
// push function with relevant query string values every time settings change
export const queryStringMiddleware = push => {
  const _settingsMiddleware = settingsMiddleware(push)
  return store => next => action => {
    switch(action.type){
    case 'COMPONENT_SETTINGS':
      return _settingsMiddleware(store, next, action)
    case 'COMPONENT_MOUNT':
      return mountComponentMiddleware(store, next, action)
    case '@@router/LOCATION_CHANGE':
      return locationChangeMiddleware(store, next, action)
    default:
      return next(action)
    }
  }
}

const settingsMiddleware = push => {
  return (store, next, action) => {
    const result = next(action)
    if(action.type !== 'COMPONENT_SETTINGS') return result

    const { channel, settings } = action
    if(!channel.settingsToQueryString) return result

    // filter settings down to qs-pushable settings for this channel
    const currentQuery = store.getState().routing.locationBeforeTransitions.query
    const qsSettings = pickBy(settings, (value, key) => {
      return includes(channel.settingsToQueryString, key) && currentQuery[key] !== value
    })
    if(!size(qsSettings)) return result

    // TODO: get current query and check for differences before pushing? or do histories not emit a change if the url is the same?

    const currentPath = store.getState().routing.locationBeforeTransitions.pathname
    store.dispatch(push({pathname: currentPath, query: qsSettings}))

    return result
  }
}

// grab query string from router when component mounts
const mountComponentMiddleware = (store, next, action) => {
  const query = store.getState().routing.locationBeforeTransitions.query
  // TODO: instead of calling settings, lets just merge settins from the query string into the
  // action's channels before calling next(), so we add query string settings to the initial state
  setSettingsFromQuery(action.channels, query, store.dispatch)

  return next(action)
}

const locationChangeMiddleware = (store, next, action) => {
  const result = next(action)
  if(action.type !== '@@router/LOCATION_CHANGE') return result
  const components = store.getState().components
  if(!components) return result

  // grab all channel objects from all current components
  const query = action.payload.query
  const currentChannels = _(components).map(_.values).flatten().value()
  setSettingsFromQuery(currentChannels, query, store.dispatch)

  return result
}

function setSettingsFromQuery(channels, query, dispatch){
  each(channels, channel => {
    const settingsToPush = _(query).pick(channel.settingsToQueryString)
      .pickBy((val, key) => channel.settings[key] !== val).value()

    if(!size(settingsToPush)) return

    dispatch(setSettings(channel, settingsToPush))
  })
}
