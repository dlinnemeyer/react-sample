function addConsignor(state, consignor){
  return state.setIn(["consignors", consignor.id], fromJS(consignor));
}

// remember to set a default value to state here that matches the empty value for consignors.
// since we key consignors to consignorid, it's an empty map
export default function(state = Map(), action) {
  switch (action.type) {
  case 'ADD_CONSIGNOR':
    return addConsignor(state, action.consignor);
  }
  return state;
}

