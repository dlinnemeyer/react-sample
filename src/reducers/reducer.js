 import {fromJS} from 'immutable';

function addConsignorLoading(state, isLoading){
  return state.setIn(["loading", "addConsignor"], isLoading);
}

function addConsignor(state, consignor){
  return state.setIn(["consignors", consignor.id], fromJS(consignor));
}

function addItemLoading(state, isLoading){
  return state.setIn(["loading","addItem"], isLoading);
}

function addItem(state, item){
  return state.setIn(["items", item.id], fromJS(item))
  // this is only necessary because we're persisting to localstorage. if we're backed with a
  // database, this wouldn't be here.
    .updateIn(["consignors", item.consignorid, "items"], items => items.push(item.id));
}

export default function(state = Map(), action) {
  switch (action.type) {
  case 'ADD_CONSIGNOR_LOADING':
    return addConsignorLoading(state, true);
  case 'ADD_CONSIGNOR':
    return addConsignorLoading(addConsignor(state, action.consignor), false);
  case 'ADD_ITEM_LOADING':
    return addItemLoading(state, true);
  case 'ADD_ITEM':
    return addItemLoading(addItem(state, action.item), false);
  case '@@INIT':
    return state;
  default:
    throw new Error("UNKNOWN ACTION: "+action.type);
  }
  return state;
}
