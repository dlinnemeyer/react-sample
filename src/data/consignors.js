import {promiseDelay} from './misc'
import store from 'store'
import {arrToHash} from '../misc'

// exported because we use it in certain hackish contexts for development reasons. should be removed
// later
export function __getConsignors(){
  return store.get("consignors") || {};
}

export function __setConsignors(consignors){
  return store.set("consignors", consignors);
}

export function getAll(ids){
  return promiseDelay((resolve, reject) => {
    const allConsignors = __getConsignors();
    const consignors = ids
      ? arrToHash(ids.map(id => allConsignors[id]).filter(c => !!(c)))
      : allConsignors;
    resolve(consignors);
  });
}

export function search(data){
  return promiseDelay((resolve, reject) => {
    const allConsignors = __getConsignors();
    // TODO: filter based on data object
    const filtered = allConsignors;
    resolve(filtered);
  });
}

export function add(consignor){
  return promiseDelay((resolve, reject) => {
    if(!consignor.items) consignor.items = [];
    if(!consignor.id) consignor.id = (Math.floor(Math.random() * 1000000)) + "";

    const consignors = __getConsignors();
    const emails = Object.keys(consignors).map(id => consignors[id].email);
    if(emails.indexOf(consignor.email) > -1){
      reject({code: 23, title: "duplicate_email"});
      return;
    }

    consignors[consignor.id] = consignor;
    __setConsignors(consignors);
    resolve(consignor);
  });
}

// another "ajax" call
export function del(consignor){
  return promiseDelay((resolve, reject) => {
    const consignors = __getConsignors();
    delete consignors[consignor.id];
    __setConsignors(consignors);
    resolve(consignor);
  });
}
