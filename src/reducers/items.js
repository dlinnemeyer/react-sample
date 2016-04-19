function addItem(state, item){
  return Object.assign({}, state, {
    [item.id]: item
  });
}

function deleteItem(state, item){
  let newState = Object.assign({}, state);
  delete newState[item.id];
  return newState;
}


export default function(state = {}, action) {
  switch (action.type) {
  case 'ADD_ITEM':
    return addItem(state,action.item);
  case 'DELETE_ITEM':
    return deleteItem(state,action.item);
  }
  return state;
}
