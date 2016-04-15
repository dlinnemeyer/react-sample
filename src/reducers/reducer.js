 import {fromJS, List,Map} from 'immutable';

function setState(state, newState){
  return state.merge(newState);
}

function loading(state){
  return state.set('loading', true);
}

function loaded(state){
  return state.set('loading', false);
}

function addConsignor(state, consignor){
  return state.set("consignors", state.get("consignors").set(consignor.id, fromJS(consignor)));
}

function addItem(state, item){
  let newState = state.set("items", state.get("items").set(item.id, fromJS(item)));
  // this is only necessary because we're persisting to localstorage. if we're backed with a
  // database, this wouldn't be here.
  let consignor = state.get("consignors").get(item.consignorid);
  consignor = consignor.set("items", consignor.get("items").push(item.id));
  console.log(consignor.get("items"), item, item.id);
  return newState.set("consignors", state.get("consignors").set(consignor.get("id"), consignor));
}

export default function(state = Map(), action) {
  if(action.loaded) state = loaded(state);

  switch (action.type) {
  case 'SET_STATE':
    return setState(state, action.state);
  case 'LOADING':
    return loading(state);
  case 'ADD_CONSIGNOR':
    return addConsignor(state, action.consignor);
  case 'ADD_ITEM':
    return addItem(state, action.item);
  case '@@INIT':
    return state;
  default:
    throw new Error("UNKNOWN ACTION: "+action.type);
  }
  return state;
}
