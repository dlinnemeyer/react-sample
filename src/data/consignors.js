import {promiseDelay} from './misc'
import store from 'store'
import {arrToHash} from '../misc'

function getConsignors(){
  return store.get("consignors") || {};
}

export function get(id){
  return promiseDelay((resolve, reject) => {
    resolve(getConsignors()[id]);
  });
}

export function getAll(ids){
  return promiseDelay((resolve, reject) => {
    const allConsignors = getConsignors();
    const consignors = ids
      ? arrToHash(ids.map(id => allConsignors[id]).filter(c => !!(c)))
      : allConsignors;
    resolve(consignors);
  });
}


export function add(consignor){
  return promiseDelay((resolve, reject) => {
    if(!consignor.items) consignor.items = [];
    if(!consignor.id) consignor.id = (Math.floor(Math.random() * 1000000)) + "";

    const consignors = getConsignors();
    const emails = Object.keys(consignors).map(id => consignors[id].email);
    if(emails.indexOf(consignor.email) > -1){
      reject({code: 23, title: "duplicate_email"});
      return;
    }

    consignors[consignor.id] = consignor;
    store.set("consignors", consignors);
    resolve(consignor);
  });
}

// another "ajax" call
export function del(consignor){
  return promiseDelay((resolve, reject) => {
    const consignors = getConsignors();
    delete consignors[consignor.id];
    store.set("consignors", consignors);
    resolve(consignor);
  });
}
