import {promiseDelay} from './misc'
import store from 'store'
import {arrToHash} from '../misc'
import {__getConsignors, __setConsignors} from './consignors'
import {isUndefined, isNumber, isBoolean} from 'util'

export function __getItems(){
  return store.get("items") || {}
}

export function __setItems(items){
  return store.set("items", items)
}

export function getAll(ids){
  return promiseDelay((resolve, reject) => {
    const allItems = __getItems()
    const items = isUndefined(ids)
      ? allItems
      : arrToHash(ids.map(id => allItems[id]).filter(c => !!(c)))
    resolve(items)
  })
}

export function add(item){
  return promiseDelay((resolve, reject) => {
    if(!item.id) item.id = (Math.floor(Math.random() * 1000000)) + ""

    const items = __getItems()
    const skus = Object.keys(items).map(id => items[id].sku)
    if(skus.indexOf(item.sku) > -1){
      reject({code: 23, title: "duplicate_sku"})
      return
    }

    items[item.id] = item
    store.set("items", items)

    // also tack on itemid for the consignor. wouldn't have to do
    const consignors = __getConsignors()
    const consignor = consignors[item.consignorid]
    consignor.items = [...consignor.items, item.id]
    consignors[item.consignorid] = consignor
    __setConsignors(consignors)
    resolve(item)
  })
}

export function del(item){
  return promiseDelay((resolve, reject) => {
    const items = __getItems()
    delete items[item.id]
    store.set("items", items)
    resolve(item)
  })
}

export function search(data, sortBy){
  return promiseDelay((resolve, reject) => {
    const allItems = __getItems()

    const items = {}
    Object.keys(allItems).filter(id => {
      return searchCompare(data, allItems[id])
    }).sort((a, b) => {
      return sortCompare(allItems[a], allItems[b], sortBy)
    }).forEach(id => {
      items[id] = allItems[id]
    })

    resolve(items)
  })
}

function sortCompare(a, b, sortBy){
  const aVal = getSortValue(a, sortBy)
  const bVal = getSortValue(b, sortBy)
  return isNumber(aVal) ? aVal - bVal : aVal.localeCompare(bVal)
}

function getSortValue(item, sortBy){
  switch(sortBy){
    default:
      return item[sortBy] || ""
  }
}

function searchCompare(data, item){
  // all searches have to match, so we'll start true and invalidate
  let match = true
  Object.keys(data).forEach(k => {
    if(!fieldCompare(data[k], item[k])){
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
  if(isBoolean(value)){
    const approvedValues = value ? [true, "1", "true", 1] : [false, "0", "false", 0]
    return approvedValues.indexOf(search) !== -1
  }

  // otherwise, just do string comparison. simple enough, since this code will be replaced by server
  // stuff anyway
  search = search ? search.toString() : ""
  value = value ? value.toString() : ""
  return value.toLowerCase().indexOf(search.toLowerCase()) !== -1
}
