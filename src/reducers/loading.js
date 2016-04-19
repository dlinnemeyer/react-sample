// NOT IN USE ANYWHERE CURRENTLY
// Just left this in here for example's sake, since I'm pretty sure we'll need this for page loading
// or something like that.
//
// redux-form does a great job of handling loading/submitting for forms. But we'll have other contexts
// we'll need loading I'm assuming? or just page loads?
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
