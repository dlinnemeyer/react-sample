import {promiseDelay} from './misc'
import store from 'store'
import {arrToHash} from '../misc'

function getItems(){
  return store.get("items") || {};
}

export function getAll(ids, state){
  return promiseDelay((resolve, reject) => {
    const allItems = getItems();
    const items = ids
      ? arrToHash(ids.map(id => allItems[id]).filter(c => !!(c)))
      : allItems;
    resolve(items);
  });
}

export function add(item){
  return promiseDelay((resolve, reject) => {
    if(!item.id) item.id = (Math.floor(Math.random() * 1000000)) + "";

    const items = getItems();
    const skus = Object.keys(items).map(id => items[id].sku);
    if(skus.indexOf(item.sku) > -1){
      reject({code: 23, title: "duplicate_sku"});
      return;
    }

    items[item.id] = item;
    store.set("items", items);

    // also tack on itemid for the consignor. wouldn't have to do
    const consignors = store.get("consignors");
    const consignor = consignors[item.consignorid];
    consignor.items = [...consignor.items, item.id];
    consignors[item.consignorid] = consignor;
    store.set("consignors", consignors);
    resolve(item);
  });
}

export function del(item){
  return promiseDelay((resolve, reject) => {
    const items = getItems();
    delete items[item.id];
    store.set("items", items);
    resolve(item);
  });
}
