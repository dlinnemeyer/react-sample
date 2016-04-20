function addConsignor(state, consignor){
  return Object.assign({}, state, {
    [consignor.id]: consignor
  });
}

function deleteConsignor(state, consignor){
  let newState = Object.assign({}, state);
  delete newState[consignor.id];
  return newState;
}

function addItemMapping(state, item){
  // doing immutable stuff in straight JS is starting to get ugly. but immutable doesn't play
  // nicely with other libraries. WHAT TO DO?!?! There must be some nice functional library
  // out there that offers quick immutable mutation functions? react update helper looked
  // alright, but a little weird (http://facebook.github.io/react/docs/update.html)
  let consignor = Object.assign({}, state[item.consignorid]);
  consignor.items = [...consignor.items, item.id];
  return Object.assign({}, state, {
    [item.consignorid]: consignor
  });
}

function deleteItemMapping(state, item){
  let consignor = Object.assign({}, state[item.consignorid]);
  consignor.items = consignor.items.filter(id => id !== item.id);
  return Object.assign({}, state, {
    [item.consignorid]: consignor
  });
}

// remember to set a default value to state here that matches the empty value for consignors.
// since we key consignors to consignorid, it's an empty map
export default function(state = {}, action) {
  switch (action.type) {
  case 'ADD_CONSIGNOR':
    return addConsignor(state, action.consignor);
  case 'DELETE_CONSIGNOR':
    return deleteConsignor(state, action.consignor);
  case 'GET_CONSIGNOR':
    return addConsignor(state, action.consignor);
  // this is only necessarily because we're pushign to local storage, and we have to explicitly
  // map the items both ways.
  case 'ADD_ITEM':
    return addItemMapping(state, action.item);
  case 'DELETE_ITEM':
    return deleteItemMapping(state, action.item);
  }
  return state;
}

