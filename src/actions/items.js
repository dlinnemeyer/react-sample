import * as items from "../data/items"

// TODO: abstract this? this file is pretty much identical to the consignors actions.
// I wonder if we could just have generic model functions that add/delete/load models and
// store them in a standardized way?
// Then again, as we build out app functionality, we might notice more divergence?
// And to be fair, the main repetition is in the thunk structure.

export function addItem(item){
  return (dispatch, getStore) => {
    // We don't bother with error handling on this promise. We don't have any global error handling
    // to do, and components actually calling this action can catch errors.
    // Or should we find a way to defer a global error handling? Somehow only run it if nothing
    // else handles the error?
    return items.add(item)
      .then(item => {
        dispatch(addItemAction(item));
        // in case anyone else is chaining on this? though they probably shouldn't, since
        // everything else should flow through redux actions/reducers?
        return item;
      });
  }
}

export function deleteItem(item){
  return (dispatch, getStore) => {
    return items.del(item)
      .then(item => {
        dispatch(deleteItemAction(item));
        return item;
      });
  }
}

export function loadItems(ids){
  return (dispatch, getStore) => {
    return items.getAll(ids)
      .then(items => {
        dispatch(loadItemsAction(items));
        return items;
      });
  }
}

function addItemAction(item){
  return { type: 'ADD_ITEM', item }
}

function deleteItemAction(item){
  return { type: 'DELETE_ITEM', item }
}

function loadItemsAction(items){
  return { type: 'LOAD_ITEMS', items }
}
