import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import _, {mapValues, keys, each, assign, isEqual} from 'lodash'

// higher-order component to provide basic connection to redux-stored component goodies for channels,
// like errors, loading state, resulting data, etc.
export function asyncify(Component, componentId, channels = {}){
  // build-in system-wide channel defaults from the beginning, and wrap the load function
  // to thunkify it
  // TODO: make this a separate, testable lil' function
  channels = mapValues(channels, (channel, chid) => {
    return assign({}, defaultChannel, channel, {
      id: chid, // add a convenient id reference
      load: thunkifyAndWrap(channel.load, componentId, chid)
    })
  })
  // convenience, so we don't have to keep calling keys
  const channelIds = keys(channels)

  const wrapper = React.createClass({

    // gets current channels from props, all updated and such
    channels(){
      return channelIds.map(chid => this.props[chid])
    },

    componentWillMount(){
      _(this.channels()).filter(ch => ch.onLoad).each(ch => {
        ch.load(ch.settings)
      })
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
    each(channels, channel => {
      const stateChannel = component[channel.id]
      props[channel.id] = Object.assign({}, channel, stateChannel)
    })

    // TODO: add some global things, like isAnyLoading, isAnyErrors, etc.?

    return props
  }

  function mapDispatchToProps(dispatch){
    const props = {}
    // make sure to just make objects with the functions as keys, and not to modify the original
    // object by reference.
    // mapStateToProps handles the other keys, so no need for those.
    // And modifying the object by reference on the original channel object would mean
    // we'd keep wrapping over and over again
    // TODO: look into the version of mapDispatchToProps that returns a function. the docs claim
    // we can memoize, which would be nice, so we don't have to keep function wrapping?
    each(channels, channel => {
      props[channel.id] = {
        load: (...args) => dispatch(channel.load(...args)),
        setSettings: (settings) => dispatch(setSettings(componentId, channel.id, settings))
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
  settings: {},
  loading: false,
  data: {},
  //error, leaving error undefined so we can do nice if(!ch.error) stuffs
  onLoad: false,
  onChange: false
}


// take a promise-returning function. return a thunk that wraps that promise with loading/error
// logic, but provides the same interface (just passes args onto the child function).
// whatever data is returned by the promise is set to data when the promise resolves, and the same
// goes for errors
export function thunkifyAndWrap(func, componentId, channelId){
  return (...args) => {
    // quick function wrappers to make the flow in the code below more obvious
    const _loading = (x) => loading(componentId, channelId, x)
    const _setData = (x) => setData(componentId, channelId, x)
    const _error= (x) => error(componentId, channelId, x)

    return dispatch => {
      dispatch(_loading(true))
      return func(...args)
        .then(response => {
          dispatch(_setData(response))
          dispatch(_loading(false))
          return response
        })
        .catch(err => {
          dispatch(_error(err))
          dispatch(_loading(false))
          return err
        })
    }
  }
}

function setSettings(id, subId, data){
  return {
    type: 'COMPONENT_SETTINGS',
    id,
    subId,
    data
  }
}

function loading(id, subId, isLoading){
  return {
    type: 'COMPONENT_LOADING',
    isLoading,
    id,
    subId
  }
}

function error(id, subId, data){
  return {
    type: "COMPONENT_ERROR",
    id,
    subId,
    data
  }
}

function setData(id, subId, data){
  return {
    type: "COMPONENT_DATA",
    id,
    subId,
    data
  }
}

function reducerSet(state, id, subId, key, data){
  const component = state[id] || {}
  // this just overrides the data set on key. we don't merge for that, though we obviously merge
  // for sub-components and components so we don't run over that data
  const subComponent = Object.assign({}, component[subId] || {}, {
    [key]: data
  })
  // immutable is silly when you get three keys deep, ain't it?
  const mergedComponent = Object.assign({}, component, {
    [subId] : subComponent
  })

  return Object.assign({}, state, {
    [id]: mergedComponent
  })
}

export function reducer(state = {}, action) {
  switch (action.type) {
  case 'COMPONENT_DATA':
    return reducerSet(state, action.id, action.subId, 'data', action.data)
  case 'COMPONENT_LOADING':
    return reducerSet(state, action.id, action.subId, 'loading', action.isLoading)
  case 'COMPONENT_ERROR':
    return reducerSet(state, action.id, action.subId, 'error', action.data)
  case 'COMPONENT_SETTINGS':
    return reducerSet(state, action.id, action.subId, 'settings', action.data)
  }
  return state
}
