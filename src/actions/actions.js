export function addConsignor(consignor){
  return (dispatch, getStore) => {
    dispatch(addConsignorLoading());
    return goAddConsignor(consignor)
      .then((consignor) => dispatch(addConsignorAction(consignor)))
      .then(() => dispatch(addConsignorLoading(false)));
  }
}
export function addItem(item){
  return (dispatch, getStore) => {
    dispatch(addItemLoading());
    return goAddItem(item)
      .then((item) => dispatch(addItemAction(item)))
      .then(() => dispatch(addItemLoading(false)));
  }
}


// this would be the actual ajax call. it'd probably be somewhere else in some library for
// data grabbing
function goAddConsignor(consignor){
  if(!consignor.items) consignor.items = [];
  if(!consignor.id) consignor.id = (Math.floor(Math.random() * 1000000)) + "";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(consignor);
    }, Math.random() * 1000 + 1000);
  });
}

// another "ajax" call
function goAddItem(item){
  if(!item.id) item.id = (Math.floor(Math.random() * 1000000)) + "";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(item);
    }, Math.random() * 1000 + 1000);
  });
}


// not sure what to call this? it's the pure action generator, as opposed to the thunk-ified one
// we actually call from our code
function addConsignorAction(consignor){
  return { type: 'ADD_CONSIGNOR', consignor }
}

function addConsignorLoading(isLoading = true){
  return { type: 'ADD_CONSIGNOR_LOADING', isLoading }
}

// not sure what to call this? it's the pure action generator, as opposed to the thunk-ified one
// we actually call from our code
function addItemAction(item){
  return { type: 'ADD_ITEM', item }
}

function addItemLoading(isLoading = true){
  return { type: 'ADD_ITEM_LOADING', isLoading }
}
