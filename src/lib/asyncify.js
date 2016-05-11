import React from 'react'
import {connect} from 'react-redux'

export function asyncify(Component, componentId, channels = {}){
  const wrapper = React.createClass({
    render(){
      const props = this.props

      // wrap all their load functions in asyncWrap, so we can handling loading/errors,
      // and dispatch, so they get the simple, non-dispatch interface
      Object.keys(channels).forEach(ch => {
        if(props[ch].load) {
          const wrapped = asyncWrap(props[ch].load, componentId, ch)
          props[ch].load = (...args) => props.dispatch(wrapped(...args))
        }
      })

      return <Component {...props} />
    }
  })

  function mapStateToProps(state){
    const component = Object.assign({}, state.components[componentId])

    const props = {componentId}
    Object.keys(channels).forEach(ch => {
      const channel = channels[ch]
      props[ch] = Object.assign({data: {}, loading: false, error: {}}, channel, component[ch])
    })

    // TODO: add some global things, like isAnyLoading, isAnyErrors, etc.?

    return props
  }

  return connect(mapStateToProps)(wrapper)
}

// take a thunk. return a function that calls the thunk with its normal arguments, but
// wraps it in action dispatches that set loading, data, errors on the passed componentid/channelid.
// whatever data is returned by the promise in the thunk is set to data when the promise resolves
export function asyncWrap(func, componentId, channelId){
  return (...args) => {
    // we're assuming a thunk here, so at this point, so this will be a function
    // that takes dispatch and returns a promise.
    // TODO: it'd be nice not to assume their function is a thunk? But not sure how
    // else to do it, since we do need to let them dispatch things, and we do need
    // a promise.
    const getMeMyPromise = func(...args)

    return dispatch => {
      dispatch(loading(componentId, channelId, true))
      return getMeMyPromise(dispatch)
        .then((response) => {
          dispatch(setData(componentId, channelId, response))
          return response
        })
    }
  }
}

function loading(id, subId = "_", isLoading){
  return {
    type: 'COMPONENT_LOADING',
    isLoading,
    id,
    subId
  }
}

// function error(id, message){
//   return {
//     type: "COMPONENT_ERROR",
//     id,
//     message
//   }
// }

function setData(id, subId = "_", data){
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
    return reducerSet(reducerSet(state, action.id, action.subId, 'data', action.data),
      action.id, action.subId, 'loading', false)
  case 'COMPONENT_LOADING':
    return reducerSet(state, action.id, action.subId, 'loading', action.isLoading)
  case 'COMPONENT_ERROR':
    return reducerSet(state, action.id, action.subId, 'error', action.message)
  case 'COMPONENT_SETTINGS':
    return reducerSet(state, action.id, action.subId, 'settings', action.settings)
  }
  return state
}
