import {add, del, get, getAll, search, __getItems, __setItems} from "../data/items"
import {__getConsignors, __setConsignors} from "../data/consignors"
import faker from "faker"
import {size, keyBy, filter, includes} from 'lodash'
// I don't like the globalErrorize method, since the current methodology forces every async action
// to remember to add it. I wonder if we could add a wrapper to ajax calls
// that could handle calling the globalError action on specified error codes. for example:
//    function errorizedAjax(...args){
//      return call(ajax, args)
//        // for 500+ errors
//        .catch(serverErrorize)
//        // for authorized errors
//        .catch(authErrorize);
//    }
// We could also pass it only error codes we want to ignore. or we could pass it a hash of
// error code => handler. or something nice and function, where errorizedAjax returns a function
// that calls ajax and auto-adds the handlers. either way is fine.
import {globalErrorize} from "./misc"

// TODO: abstract this? this file is pretty much identical to the consignors actions.
// I wonder if we could just have generic model functions that add/delete/load models and
// store them in a standardized way?
// Then again, as we build out app functionality, we might notice more divergence?
// And to be fair, the main repetition is in the thunk structure.

export function addItem(data){
  return (dispatch) => {
    // We don't bother with error handling on this promise. We don't have any global error handling
    // to do, and components actually calling this action can catch errors.
    // Or should we find a way to defer a global error handling? Somehow only run it if nothing
    // else handles the error?
    return add(data)
      .then(item => {
        dispatch(addItemAction(item))
        // in case anyone else is chaining on this? though they probably shouldn't, since
        // everything else should flow through redux actions/reducers?
        return item
      })
      .catch(globalErrorize(dispatch))
  }
}

export function deleteItem(data){
  return (dispatch) => {
    return del(data)
      .then(item => {
        dispatch(deleteItemAction(item))
        return item
      })
      .catch(globalErrorize(dispatch))
  }
}

export function loadItems(ids){
  return (dispatch) => {
    return getAll(ids)
      .then(items => {
        dispatch(loadItemsAction(items))
        return items
      })
  }
}

export function loadItem(id){
  return (dispatch) => {
    return get(id)
      .then(item => {
        dispatch(loadItemsAction({id: item}))
        return item
      })
  }
}

export function searchItems(){
  return 'test'
}

export function addFakeItems(num = 50){
  const newItems = {}
  const consignors =__getConsignors()
  let i = 0
  while(num > i){
    const item = fakeItem()
    newItems[item.id] = item

    const consignor = faker.random.objectElement(consignors)
    item.consignorid = consignor.id
    consignor.items.push(item.id)

    i = i + 1
  }
  __setItems(Object.assign({},
    __getItems(),
    newItems
  ))
  __setConsignors(consignors)

  return loadItemsAction(newItems)
}

export function deleteAllItems(){
  return dispatch => {
    const all = __getItems()
    __setItems({})
    Object.keys(all).forEach(iid => dispatch(deleteItemAction(all[iid])))
  }
}


function fakeItem(){
  // trying to get a more realistic distribution here
  const priceMax = faker.random.number(10) > 8 ? 5000 : 100
  const random = (odds, value) => faker.random.number(10) < odds ? value : ""
  const times = (n, func) => {
    let i = 0
    let results = ""
    while(n > i){
      results += func()
      i = i + 1
    }
    return results
  }
  return {
    id: faker.random.uuid(),
    sku: times(16, faker.random.alphaNumeric),
    title: faker.commerce.product(),
    brand: random(8, faker.company.companyName()),
    color: random(8, faker.commerce.color()),
    size: random(8, times(2, faker.random.alphaNumeric)),
    description: random(8, faker.commerce.productName()),
    percSplit: faker.random.number(100),
    price: faker.commerce.price(0, priceMax),
    printed: faker.random.boolean()
  }
}


function addItemAction(item){
  return { type: 'ADD_ITEM', item }
}

function deleteItemAction(item){
  return { type: 'DELETE_ITEM', item }
}

function loadItemsAction(items){
  return { type: 'LOAD_ITEMS', items }
}
