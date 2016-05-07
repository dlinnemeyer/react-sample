import {promiseDelay} from './misc'
import store from 'store'
import {arrToHash} from '../misc'
import {__getConsignors, __setConsignors} from './consignors'
import {isUndefined} from 'util'

export function __getItems(){
  return store.get("items") || {};
}

export function __setItems(items){
  return store.set("items", items);
}

export function getAll(ids){
  return promiseDelay((resolve, reject) => {
    const allItems = __getItems();
    const items = isUndefined(ids)
      ? allItems
      : arrToHash(ids.map(id => allItems[id]).filter(c => !!(c)));
    resolve(items);
  });
}

export function add(item){
  return promiseDelay((resolve, reject) => {
    if(!item.id) item.id = (Math.floor(Math.random() * 1000000)) + "";

    const items = __getItems();
    const skus = Object.keys(items).map(id => items[id].sku);
    if(skus.indexOf(item.sku) > -1){
      reject({code: 23, title: "duplicate_sku"});
      return;
    }

    items[item.id] = item;
    store.set("items", items);

    // also tack on itemid for the consignor. wouldn't have to do
    const consignors = __getConsignors();
    const consignor = consignors[item.consignorid];
    consignor.items = [...consignor.items, item.id];
    consignors[item.consignorid] = consignor;
    __setConsignors(consignors);
    resolve(item);
  });
}

export function del(item){
  return promiseDelay((resolve, reject) => {
    const items = __getItems();
    delete items[item.id];
    store.set("items", items);
    resolve(item);
  });
}
