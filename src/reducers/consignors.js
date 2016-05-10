function loadConsignor(state, consignor){
  return Object.assign({}, state, {
    [consignor.id]: consignor
  })
}

function loadConsignors(state, consignors){
  return Object.assign({}, state, consignors)
}

function deleteConsignor(state, consignor){
  const newState = Object.assign({}, state)
  delete newState[consignor.id]
  return newState
}

function addItemMapping(state, item){
  // doing immutable stuff in straight JS is starting to get ugly. but immutable doesn't play
  // nicely with other libraries. WHAT TO DO?!?! There must be some nice functional library
  // out there that offers quick immutable mutation functions? react update helper looked
  // alright, but a little weird (http://facebook.github.io/react/docs/update.html)
  const consignor = Object.assign({}, state[item.consignorid])
  if(!consignor) return state

  consignor.items = consignor.items ? [...consignor.items, item.id] : [item.id]
  return Object.assign({}, state, {
    [item.consignorid]: consignor
  })
}

function deleteItemMapping(state, item){
  const consignor = Object.assign({}, state[item.consignorid])
  if(!consignor) return state

  consignor.items = consignor.items.filter(id => id !== item.id)
  return Object.assign({}, state, {
    [item.consignorid]: consignor
  })
}

// remember to set a default value to state here that matches the empty value for consignors.
// since we key consignors to consignorid, it's an empty map
export default function(state = {}, action) {
  switch (action.type) {
  case 'ADD_CONSIGNOR':
    return loadConsignor(state, action.consignor)
  case 'DELETE_CONSIGNOR':
    return deleteConsignor(state, action.consignor)
  case 'LOAD_CONSIGNORS':
    return loadConsignors(state, action.consignors)
  // this is only necessarily because we're pushign to local storage, and we have to explicitly
  // map the items both ways.
  case 'ADD_ITEM':
    return addItemMapping(state, action.item)
  case 'DELETE_ITEM':
    return deleteItemMapping(state, action.item)
  }
  return state
}

