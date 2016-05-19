import {each, assign, omitBy, isFunction} from 'lodash'

function mergeChannel(state, {componentId, id: channelId}, merge){
  // merge the values from the action into the channel, all immutable like
  const component = state[componentId] || {}
  const mergedComponent = assign({}, component, {
    [channelId] : assign({}, component[channelId] || {}, merge)
  })

  return Object.assign({}, state, {
    [componentId]: mergedComponent
  })
}

function mergeSettings(state, channel, settings){
  return mergeChannel(state, channel, {
    settings: assign({}, state[channel.componentId][channel.id].settings, settings)
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
      // is prop-ified, with stuff like load/mergeSettings
      state = mergeChannel(state, channel, toStateChannel(channel))
    })
    return state
  case 'COMPONENT_UNMOUNT':
    return destroyComponent(state, action.componentId)
  case 'COMPONENT_LOAD_START':
    return mergeChannel(state, action.channel, {loading: true, hasInitializedLoading: true})
  case 'COMPONENT_LOAD_ERROR':
    return mergeChannel(state, action.channel, {data: undefined, loading: false, error: action.error})
  case 'COMPONENT_LOAD_SUCCESS':
    return mergeChannel(state, action.channel, {data: action.data, loading: false, error: undefined})
  case 'COMPONENT_MERGE_SETTINGS':
    return mergeSettings(state, action.channel, action.settings)
  case 'COMPONENT_REPLACE_SETTINGS':
    return mergeChannel(state, action.channel, {settings: action.settings})
  }
  return state
}

