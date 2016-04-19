export function addConsignor(consignor){
  return (dispatch, getStore) => {
    // We don't bother with error handling on this promise. We don't have any global error handling
    // to do, and components actually calling this action can catch errors.
    // Or should we find a way to defer a global error handling? Somehow only run it if nothing
    // else handles the error?
    return goAddConsignor(consignor, getStore())
      .then(
        consignor => {
          dispatch(addConsignorAction(consignor));
          // in case anyone else is chaining on this? though they probably shouldn't, since
          // everything else should flow through redux actions/reducers?
          return consignor;
        }
      );
  }
}
export function addItem(item){
  return (dispatch, getStore) => {
    return goAddItem(item)
      .then((item) => dispatch(addItemAction(item)));
  }
}


// this would be the actual ajax call. it'd probably be somewhere else in some library for
// data grabbing
function goAddConsignor(consignor, store){
  if(!consignor.items) consignor.items = [];
  if(!consignor.id) consignor.id = (Math.floor(Math.random() * 1000000)) + "";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emails = Object.keys(store.consignors).map(id => store.consignors[id].email);
      if(emails.indexOf(consignor.email) > -1){
        reject({code: 23, title: "duplicate_email"});
        return;
      }
      // random network error
      let err = {};
      if(err = randomNetworkError()){
        reject(err);
        return;
      }

      resolve(consignor);
    }, Math.random() * 1000 + 1000);
  });
}

// another "ajax" call
function goAddItem(item){
  if(!item.id) item.id = (Math.floor(Math.random() * 1000000)) + "";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // normally the server would handle this. we could check the store, but that's not practical,
      // since we don't have the store here. and I don't want these functions messing with store
      // globals
      resolve(item);
    }, Math.random() * 1000 + 1000);
  });
}

function randomNetworkError(){
  return Math.floor(Math.random() * 10) > 8 ? {code: 99, title: 'server_error'} : null;
}


// not sure what to call this? it's the pure action generator, as opposed to the thunk-ified one
// we actually call from our code
function addConsignorAction(consignor){
  return { type: 'ADD_CONSIGNOR', consignor }
}

// not sure what to call this? it's the pure action generator, as opposed to the thunk-ified one
// we actually call from our code
function addItemAction(item){
  return { type: 'ADD_ITEM', item }
}
