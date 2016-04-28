import * as items from "../data/items"
// I don't like the globalErrorize method, since the current methodology forces every async action
// to remember to add it. I wonder if we could add a wrapper to ajax calls
// that could handle calling the globalError action on specified error codes. for example:
//    function errorizedAjax(...args){
//      return call(ajax, args)
//        // for 500+ errors
//        .catch(serverErrorize)
//        // for authorized errors
//        .catch(authErrorize);
//    }
// We could also pass it only error codes we want to ignore. or we could pass it a hash of
// error code => handler. or something nice and function, where errorizedAjax returns a function
// that calls ajax and auto-adds the handlers. either way is fine.
import {globalErrorize} from "./misc"

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
      })
      .catch(globalErrorize(dispatch));
  }
}

export function deleteItem(item){
  return (dispatch, getStore) => {
    return items.del(item)
      .then(item => {
        dispatch(deleteItemAction(item));
        return item;
      })
      .catch(globalErrorize(dispatch));
  }
}

export function loadItems(ids){
  return (dispatch, getStore) => {
    return items.getAll(ids)
      .then(items => {
        dispatch(loadItemsAction(items));
        return items;
      })
      .catch(globalErrorize(dispatch));
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
