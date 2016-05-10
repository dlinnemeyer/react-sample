function loadItem(state, item){
  return Object.assign({}, state, {
    [item.id]: item
  })
}

function loadItems(state, items){
  return Object.assign({}, state, items)
}

function deleteItem(state, item){
  let newState = Object.assign({}, state)
  delete newState[item.id]
  return newState
}

export default function(state = {}, action) {
  switch (action.type) {
  case 'ADD_ITEM':
    return loadItem(state,action.item)
  case 'DELETE_ITEM':
    return deleteItem(state,action.item)
  case 'LOAD_ITEMS':
    return loadItems(state, action.items)
  }
  return state
}
