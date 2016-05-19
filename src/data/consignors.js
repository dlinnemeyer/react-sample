import {promiseDelay} from './misc'
import store from 'store'
import {displayName} from '../models/consignor'
import _, {size, toString, isNumber, isBoolean, keyBy} from 'lodash'

// exported because we use it in certain hackish contexts for development reasons. should be removed
// later
export function __getConsignors(){
  return store.get("consignors") || {}
}

export function __setConsignors(consignors){
  return store.set("consignors", consignors)
}

export function get(id){
  return promiseDelay((resolve, reject) => {
    const consignor = __getConsignors()[id]
    consignor ? resolve(consignor) : reject({code: 76, title: "invalid consignorid"})
  })
}

export function getAll(ids){
  return promiseDelay((resolve) => {
    const allConsignors = __getConsignors()
    const consignors = ids
      ? keyBy(ids.map(id => allConsignors[id]).filter(c => !!(c)), "id")
      : allConsignors
    resolve(consignors)
  })
}

export function search(data = {}, sortBy = "displayName", {page = 1, perPage = 20}){
  return promiseDelay(resolve => {
    const allConsignors = __getConsignors()

    // first, search filter and sort
    const filteredIds = Object.keys(allConsignors).filter(id => {
      return searchCompare(data, allConsignors[id])
    }).sort((a, b) => {
      return sortCompare(allConsignors[a], allConsignors[b], sortBy)
    })

    // now limit/offset
    const total = size(filteredIds)
    const start = (page - 1) * perPage
    const end = start + perPage
    const consignors = _(filteredIds).slice(start, end).map(id => allConsignors[id])
      .keyBy("id").value()

    resolve({
      consignors,
      pages: Math.ceil(total / perPage),
      count: total
    })
  })
}


function sortCompare(a, b, sortBy){
  const aVal = getSortValue(a, sortBy)
  const bVal = getSortValue(b, sortBy)
  return isNumber(aVal) ? aVal - bVal : aVal.localeCompare(bVal)
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

function fieldCompare(query, value){
  // simple stuff
  if(!query || !query.length || query == value) return true

  // booleans
  if(isBoolean(value)){
    const approvedValues = value ? [true, "1", "true", 1] : [false, "0", "false", 0]
    return approvedValues.indexOf(query) !== -1
  }

  // otherwise, just do string comparison. simple enough, since this code will be replaced by server
  // stuff anyway
  query = query ? toString(query) : ""
  value = value ? toString(value) : ""
  return value.toLowerCase().indexOf(query.toLowerCase()) !== -1
}

export function add(consignor){
  return promiseDelay((resolve, reject) => {
    if(!consignor.items) consignor.items = []
    if(!consignor.id) consignor.id = toString(Math.floor(Math.random() * 1000000))

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
  return promiseDelay((resolve) => {
    const consignors = __getConsignors()
    delete consignors[consignor.id]
    __setConsignors(consignors)
    resolve(consignor)
  })
}
