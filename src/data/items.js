import {promiseDelay} from './misc'
import store from 'store'
import {__getConsignors, __setConsignors} from './consignors'
import _, {includes, has, assign, size, isUndefined, isNumber, isBoolean, toString, keyBy} from 'lodash'
import faker from "faker"

export function __getItems(){
  return store.get("items") || {}
}

export function __setItems(items){
  return store.set("items", items)
}

export function getPriceMessage(item){
  return promiseDelay(resolve => {
    resolve({
      message: item.brand
        ? `The average price for ${item.brand} is ${faker.commerce.price(0, 200)}`
        : ""
    })
  })
}

export function get(id){
  return promiseDelay((resolve, reject) => {
    const item = __getItems()[id]
    item ? resolve(item) : reject({code: 76, title: "invalid itemid"})
  })
}

export function getAll(ids){
  return promiseDelay((resolve) => {
    const allItems = __getItems()
    const items = isUndefined(ids)
      ? allItems
      : keyBy(ids.map(id => allItems[id]).filter(c => !!(c)), "id")
    resolve(items)
  })
}

export function add(item){
  return promiseDelay((resolve, reject) => {
    if(!item.id) item.id = toString(Math.floor(Math.random() * 1000000))

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

export function edit(item){
  return promiseDelay((resolve, reject) => {
    const items = __getItems()

    if(!has(items, item.id)){
      reject({code: 27, title: "invalid_itemid"})
      return
    }

    if(item.sku){
      const otherSkus = _(items)
        .filter(c => c.id !== item.id)
        .map(c => c.sku)
        .value()

      if(includes(otherSkus, item.sku)){
        reject({code: 23, title: "duplicate_sku"})
        return
      }
    }

    // merge, in case we're only edit a single field
    const mergedItem = assign({}, items[item.id], item)
    items[item.id] = mergedItem
    __setItems(items)
    resolve(mergedItem)
  })
}

export function del(item){
  return promiseDelay((resolve) => {
    const items = __getItems()
    delete items[item.id]
    store.set("items", items)
    resolve(item)
  })
}

export function search(data = {}, sortBy = "displayName", {page = 1, perPage = 20}){
  return promiseDelay((resolve, reject) => {
    if(data.printed){
      reject({code: 172, title: "nO! no printed filter for you!"})
      return
    }
    const allItems = __getItems()

    // first, search filter and sort
    const filteredIds = Object.keys(allItems).filter(id => {
      return searchCompare(data, allItems[id])
    }).sort((a, b) => {
      return sortCompare(allItems[a], allItems[b], sortBy)
    })

    // now limit/offset
    const total = size(filteredIds)
    const start = (page - 1) * perPage
    const end = start + perPage
    const items = _(filteredIds).slice(start, end).map(id => allItems[id]).keyBy("id").value()

    resolve({
      items,
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

function getSortValue(item, sortBy){
  switch(sortBy){
    case "printed":
      return item.printed ? 1 : 0
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
  query = query ? query.toString() : ""
  value = value ? value.toString() : ""
  return value.toLowerCase().indexOf(query.toLowerCase()) !== -1
}
