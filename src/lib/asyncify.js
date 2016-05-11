import React from 'react'
import {connect} from 'react-redux'
import _, {keys, each, assign} from 'lodash'

// higher-order component to provide basic connection to redux-stored component goodies for channels,
// like errors, loading state, resulting data, etc.
export function asyncify(Component, componentId, channels = {}){
  // build-in system-wide channel defaults from the beginning
  map(channels, channel => assign({}, defaultChannel, channel))

  const wrapper = React.createClass({

    // returns all the channel objects from props, which will be updated with current settings and such
    channels(){
      keys(channels).map(chid => this.props[chid])
    },

    // HACK: doing this because our version of load() isn't wrapped with dispatch. since we do that
    // in render and pass it to the child component, we don't have access in other react lifecycle
    // methods. there must be a better way of doing this.
    loadChannel(ch){
      return this.props.dispatch(ch.load(ch.settings))
    },


    componentWillMount(){
      _(this.channels()).filter(ch => ch.onLoad).each(ch => {
        this.loadChannel(ch)
      })
    },

    channelShouldLoad(ch, before){
      return ch.onChange && !isEqual(ch.propsToSettings(before), ch.settings);
    },

    componentDidUpdate(prev){
      _(this.channels).filter(ch => channelShouldLoad(ch, prev, this.props)).each(ch => {
        this.loadChannel(ch)
      })
    },

    setSettings(channelId, settings){
      return this.props.dispatch(settings(componentId, channelId, settings))
    },

    render(){
      const props = assign({}, this.props)

      // we're doing the dispatch wrapping here because we don't have access to dispatch
      // in mapStateToProps. Is there a way to accomplish this in mapStateToProps so
      // the lifecycle functions above have access to the wrapped versions?
      each(keys(channels), ch => {
          props[ch].load = (...args) => props.dispatch(props[ch].load(...args))
          props[ch].setSettings = (settings) => this.setSettings(ch, settings)
        }
      })

      return <Component {...props} />
    }
  })

  function mapStateToProps(state, props){
    const component = Object.assign({}, state.components[componentId])
    const props = {componentId}

    // over-ride defaults with what's in the state
    Object.keys(channels).forEach(ch => {
      const userChannel = channels[ch]
      // need to slip the prop/url-based settings in before what we find in the state, but after
      // user defaults. this is for initial load, when the url may contain settings.
      // after the page loads, settings are propagated to the query afterwards, so it shouldn't matter
      // for those cases. TODO: better way to do this?
      // assigning on this level so user provided defaults don't get stomped
      const propSettings = assign(userChannel.settings, userChannel.mapPropsToSettings(props))
      const stateChannel = component[ch]
      props[ch] = Object.assign({}, userChannel, {settings: propSettings}, stateChannel)

      // load settings in from
      if(props[ch].load){
        props[ch].load = asyncWrap(props[ch].load, componentId, ch)
      }
    })

    // TODO: add some global things, like isAnyLoading, isAnyErrors, etc.?

    return props
  }

  return connect(mapStateToProps)(wrapper)
}

// TODO:
const defaultChannel = {
  settings: {},
  loading: false,
  data: {},
  //error, leaving error undefined so we can do nice if(!ch.error) stuffs
  onLoad: false,
  onChange: false,
  mapPropsToSettings: defaultMapPropsToSettings,
  settingsToQs: []
}

// this is just here to get initial settings from query string, if settings are mapped to QS
function defaultMapPropsToSettings(props, ch){
  const settings = {}
  const query = props.location.query
  _(ch.settingsToQs).filter(setting => setting in query).each(setting => {
    settings[setting] = query[setting]
  })
  return settings
}


// take a promise-returning function. return a thunk that wraps that promise with loading/error
// logic, but provides the same interface (just passes args onto the child function).
// whatever data is returned by the promise is set to data when the promise resolves, and the same
// goes for errors
export function asyncWrap(func, componentId, channelId){
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

function settings(id, subId, data){
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
    return reducerSet(state, action.id, action.subId, 'settings', action.settings)
  }
  return state
}
