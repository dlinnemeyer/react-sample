export function mountComponent(channels){
  return { type: 'COMPONENT_MOUNT', channels }
}

export function unmountComponent(componentId){
  return { type: 'COMPONENT_UNMOUNT', componentId }
}

export function mergeSettings(channel, settings){
  return { type: 'COMPONENT_MERGE_SETTINGS', channel, settings }
}

export function replaceSettings(channel, settings){
  return { type: 'COMPONENT_REPLACE_SETTINGS', channel, settings }
}

export function loadStart(channel){
  return { type: 'COMPONENT_LOAD_START', channel }
}

export function loadError(channel, error){
  return { type: "COMPONENT_LOAD_ERROR", channel, error }
}

export function loadSuccess(channel, data){
  return { type: "COMPONENT_LOAD_SUCCESS", channel, data }
}
