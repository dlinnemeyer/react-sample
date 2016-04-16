function addConsignorLoading(state, isLoading){
  return Object.assign({}, state, {
    addConsignor: isLoading
  });
}

function addItemLoading(state, isLoading){
  return Object.assign({}, state, {
    addItem: isLoading
  });
}

export default function(state = {addConsignor: false, addItem: false}, action) {
  switch (action.type) {
  case 'ADD_CONSIGNOR_LOADING':
    return addConsignorLoading(state, action.isLoading);
  case 'ADD_ITEM_LOADING':
    return addItemLoading(state, action.isLoading);
  }
  return state;
}
