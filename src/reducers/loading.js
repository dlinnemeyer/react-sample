 import {fromJS, Map} from 'immutable';

function addConsignorLoading(state, isLoading){
  return state.setIn(["loading", "addConsignor"], isLoading);
}

function addItemLoading(state, isLoading){
  return state.setIn(["loading","addItem"], isLoading);
}

export default function(state = Map({addConsignor: false, addItem: false}), action) {
  switch (action.type) {
  case 'ADD_CONSIGNOR_LOADING':
    return addConsignorLoading(state, action.isLoading);
  case 'ADD_ITEM_LOADING':
    return addItemLoading(state, action.isLoading);
  }
  return state;
}
