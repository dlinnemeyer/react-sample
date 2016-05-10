function loading(state, id, isLoading){
  return Object.assign({}, state, {
    [id]: isLoading
  })
}

export default function(state = {}, action) {
  switch (action.type) {
  case 'LOADING':
    return loading(state, action.id, action.isLoading)
  }
  return state
}
