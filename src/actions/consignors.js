import * as consignors from "../data/consignors"

export function addConsignor(consignor){
  return (dispatch, getStore) => {
    // We don't bother with error handling on this promise. We don't have any global error handling
    // to do, and components actually calling this action can catch errors.
    // Or should we find a way to defer a global error handling? Somehow only run it if nothing
    // else handles the error?
    return consignors.add(consignor, getStore())
      .then(consignor => {
        dispatch(addConsignorAction(consignor));
        // in case anyone else is chaining on this? though they probably shouldn't, since
        // everything else should flow through redux actions/reducers?
        return consignor;
      });
  }
}

export function deleteConsignor(consignor){
  return (dispatch, getStore) => {
    return consignors.del(consignor)
      .then(consignor => {
        dispatch(deleteConsignorAction(consignor));
        return consignor;
      });
  }
}

export function loadConsignors(ids){
  return (dispatch, getStore) => {
    return consignors.getAll(ids)
      .then(consignors => {
        dispatch(loadConsignorsAction(consignors));
        return consignors;
      });
  }
}

// not sure what to call this? it's the pure action generator, as opposed to the thunk-ified one
// we actually call from our code
// should we really distinguish between adding a new consignor and loading new consignors into
// state?
function addConsignorAction(consignor){
  return { type: 'ADD_CONSIGNOR', consignor }
}

function deleteConsignorAction(consignor){
  return { type: 'DELETE_CONSIGNOR', consignor }
}

function loadConsignorsAction(consignors){
  return { type: 'LOAD_CONSIGNORS', consignors }
}
