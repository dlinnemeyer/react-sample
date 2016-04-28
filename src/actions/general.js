// just mark an arbitrary loading boolean by an id string. used by components to mark themselves
// as loading
export function loading(id, isLoading){
  return {
    type: 'LOADING',
    isLoading,
    id
  }
}

export function error(id, message){
  return {
    type: "ERROR",
    id,
    message
  }
}
