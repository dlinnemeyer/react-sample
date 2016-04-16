function addItem(state, item){
  return Object.assign({}, state, {
    [item.id]: item
  });
}

export default function(state = {}, action) {
  switch (action.type) {
  case 'ADD_ITEM':
    return addItem(state,action.item);
  }
  return state;
}
