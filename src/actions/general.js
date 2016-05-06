// just mark an arbitrary loading boolean by an id string. used by components to mark themselves
// as loading
export function loading(id, subId = "_", isLoading){
  return {
    type: 'COMPONENT_LOADING',
    isLoading,
    id,
    subId
  }
}

export function error(id, message){
  return {
    type: "ERROR",
    id,
    message
  }
}

export function updateComponentData(id, subId = "_", data){
  return {
    type: "COMPONENT_DATA",
    id,
    subId,
    data
  }
}
