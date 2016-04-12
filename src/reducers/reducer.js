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

export default function(state = Map(), action) {
  if(action.loaded) state = loaded(state);

  switch (action.type) {
  case 'SET_STATE':
    return setState(state, action.state);
  case 'LOADING':
    return loading(state);
  case 'ADD_CONSIGNOR':
    return addConsignor(state, action.consignor);
  }
  return state;
}
