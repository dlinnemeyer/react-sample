function deleteConsignorLoading(state, isLoading){
  return Object.assign({}, state, {
    deleteConsignor: isLoading
  });
}

function deleteItemLoading(state, isLoading){
  return Object.assign({}, state, {
    deleteItem: isLoading
  });
}

export default function(state = {deleteConsignor: false}, action) {
  switch (action.type) {
  case 'DELETE_CONSIGNOR_LOADING':
    return deleteConsignorLoading(state, action.isLoading);
  case 'DELETE_ITEM_LOADING':
    return deleteItemLoading(state, action.isLoading);
  }
  return state;
}
