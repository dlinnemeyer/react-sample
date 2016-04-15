function goAddConsignor(consignor){
  if(!consignor.items) consignor.items = [];
  if(!consignor.id) consignor.id = (Math.floor(Math.random() * 1000000)) + "";
  return new Promise((resolve, reject) => {
    console.log("starting time!");
    setTimeout(() => {
      console.log("time!");
      resolve(consignor);
    }, Math.random() * 1000 + 1000);
  });
}

function addConsignorAction(consignor){
  return {
    type: 'ADD_CONSIGNOR',
    consignor
  }
}

export function addConsignor(consignor){
  console.log("issuing action");
  return (dispatch, getStore) => {
    return goAddConsignor(consignor)
      .then((consignor) => dispatch(addConsignorAction(consignor)));
  }
}

export function addItem(item){
  if(!item.id) item.id = (Math.floor(Math.random() * 1000000)) + "";
  return {
    type: 'ADD_ITEM',
    item
  }
}
