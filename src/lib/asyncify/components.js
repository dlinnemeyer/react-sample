import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import _, {mapValues, keys, each, assign, isEqual} from 'lodash'
import {
  mountComponent, unmountComponent, mergeSettings, replaceSettings,
  loadStart, loadError, loadSuccess
} from './actions'

// higher-order component to provide basic connection to redux-stored component goodies for channels,
// like errors, loading state, resulting data, etc.
export function asyncify(Component, componentId, channels = {}){

  // build-in system-wide channel defaults from the beginning, and wrap the load function
  // to thunkify it
  // TODO: make this a separate, testable lil' function
  const initialChannels = mapValues(channels, (channel, id) => {
    // tack on the ids to the channel. more convenient for later reference
    const newChannel = assign({}, defaultChannel, channel, {id, componentId})

    // just pass the ids into thunkifyandwrap, which is what the actions depend on.
    newChannel.load = thunkifyAndWrap(channel.load, {componentId, id})
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
    },

    componentWillUnmount(){
      this.props.dispatch(unmountComponent(componentId))
    },

    channelShouldLoad(ch, before){
      return (ch.onLoad && !ch.hasInitializedLoading)
        || (ch.onChange && !isEqual(before[ch.id].settings, ch.settings))
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
        mergeSettings: (settings) => dispatch(mergeSettings(channel, settings)),
        replaceSettings: (settings) => dispatch(replaceSettings(channel, settings))
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

export const channelPropType = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  load: PropTypes.func.isRequired,
  mergeSettings: PropTypes.func.isRequired,
  replaceSettings: PropTypes.func.isRequired,
  error: PropTypes.any,
  data: PropTypes.any,
  settings: PropTypes.object
}).isRequired

const defaultChannel = {
  loading: false,
  //error, leaving error undefined so we can do nice if(!ch.error) stuffs
  //same with data and settings
  onLoad: false,
  onChange: false,
  hasInitializedLoading: false
  // settingsToQueryString undefined
}


// take a promise-returning function. return a thunk that wraps that promise with loading/error
// logic, but provides the same interface (just passes args onto the child function).
// whatever data is returned by the promise is set to data when the promise resolves, and the same
// goes for errors
function thunkifyAndWrap(func, channel){
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
