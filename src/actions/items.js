import {__getItems, __setItems} from "../data/items"
import {__getConsignors, __setConsignors} from "../data/consignors"
import faker from "faker"

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
}

export function deleteAllItems(){
  return () => {
    __setItems({})
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
