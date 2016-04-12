export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}

export function loading(){
  return {
    type: 'LOADING'
  }
}

// for this, we should emit a loading event, send the request to the server, and on success,
// emit another action that pushes the full consignor object (with id) into the consignors list.
// just skipping the async part for now
// we'd also have to figure out forwarding them to the consignor view page after the success.
// that's *not* part of addConsignor, though. That should be part of the form itself, where we
// decide to do it afterwards.
// For that, maybe addConsignor can return a promise? the thunk middleware maybe has an architecture
// for this?
export function addConsignor(consignor){
  if(!consignor.items) consignor.items = [];
  if(!consignor.id) consignor.id = Math.floor(Math.random() * 1000000);
  return {
    type: 'ADD_CONSIGNOR',
    consignor
  }
}
