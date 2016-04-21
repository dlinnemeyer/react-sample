function loading(state, id, isLoading){
  return Object.assign({}, state, {
    [id]: isLoading
  });
}

export default function(state = {deleteConsignor: false}, action) {
  switch (action.type) {
  case 'LOADING':
    return loading(state, action.id, action.isLoading);
  }
  return state;
}
