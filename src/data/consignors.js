import {promiseDelay} from './misc'
import store from 'store'
import {arrToHash} from '../misc'
import {displayName} from '../models/consignor'
import * as util from 'util'

// exported because we use it in certain hackish contexts for development reasons. should be removed
// later
export function __getConsignors(){
  return store.get("consignors") || {}
}

export function __setConsignors(consignors){
  return store.set("consignors", consignors)
}

export function getAll(ids){
  return promiseDelay((resolve, reject) => {
    const allConsignors = __getConsignors()
    const consignors = ids
      ? arrToHash(ids.map(id => allConsignors[id]).filter(c => !!(c)))
      : allConsignors
    resolve(consignors)
  })
}

export function search(data, sortBy){
  return promiseDelay((resolve, reject) => {
    const allConsignors = __getConsignors()

    const consignors = {}
    Object.keys(allConsignors).filter(id => {
      return searchCompare(data, allConsignors[id])
    }).sort((a, b) => {
      return sortCompare(allConsignors[a], allConsignors[b], sortBy)
    }).forEach(id => {
      consignors[id] = allConsignors[id]
    })


    resolve(consignors)
  })
}

function sortCompare(a, b, sortBy){
  const aVal = getSortValue(a, sortBy)
  const bVal = getSortValue(b, sortBy)
  return util.isNumber(aVal) ? aVal - bVal : aVal.localeCompare(bVal)
}

function getSortValue(consignor, sortBy){
  switch(sortBy){
    case "displayName":
      return displayName(consignor)
    case "itemCount":
      return consignor.items.length
    case "isStoreAccount":
      return consignor.isStoreAccount ? 1 : 0
    default:
      return consignor[sortBy] || ""
  }
}

function searchCompare(data, consignor){
  // all searches have to match, so we'll start true and invalidate
  let match = true
  Object.keys(data).forEach(k => {
    if(!fieldCompare(data[k], consignor[k])){
      match = false
      return false
    }
  })

  return match
}

function fieldCompare(search, value){
  // simple stuff
  if(!search || !search.length || search == value) return true

  // booleans
  if(util.isBoolean(value)){
    const approvedValues = value ? [true, "1", "true", 1] : [false, "0", "false", 0]
    return approvedValues.indexOf(search) !== -1
  }

  // otherwise, just do string comparison. simple enough, since this code will be replaced by server
  // stuff anyway
  search = search ? search.toString() : ""
  value = value ? value.toString() : ""
  return value.toLowerCase().indexOf(search.toLowerCase()) !== -1
}

export function add(consignor){
  return promiseDelay((resolve, reject) => {
    if(!consignor.items) consignor.items = []
    if(!consignor.id) consignor.id = (Math.floor(Math.random() * 1000000)) + ""

    const consignors = __getConsignors()
    const emails = Object.keys(consignors).map(id => consignors[id].email)
    if(emails.indexOf(consignor.email) > -1){
      reject({code: 23, title: "duplicate_email"})
      return
    }

    consignors[consignor.id] = consignor
    __setConsignors(consignors)
    resolve(consignor)
  })
}

// another "ajax" call
export function del(consignor){
  return promiseDelay((resolve, reject) => {
    const consignors = __getConsignors()
    delete consignors[consignor.id]
    __setConsignors(consignors)
    resolve(consignor)
  })
}
