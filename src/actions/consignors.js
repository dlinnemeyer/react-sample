import {add, __getConsignors, __setConsignors} from "../data/consignors"
import {globalErrorize} from "./misc"
import faker from "faker"

export function addConsignor(data){
  return (dispatch) => {
    // We don't bother with error handling on this promise. We don't have any global error handling
    // to do, and components actually calling this action can catch errors.
    // Or should we find a way to defer a global error handling? Somehow only run it if nothing
    // else handles the error?
    return add(data)
      .catch(globalErrorize(dispatch))
  }
}

export function addFakeConsignors(num = 50){
  const newConsignors = {}
  let i = 0
  while(num > i){
    const consignor = fakeConsignor()
    newConsignors[consignor.id] = consignor
    i = i + 1
  }
  __setConsignors(Object.assign({},
    __getConsignors(),
    newConsignors
  ))
}

export function deleteAllConsignors(){
  return () => {
    __setConsignors({})
  }
}

function fakeConsignor(){
  return {
    id: faker.random.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    company: faker.random.number(10) > 7 ? faker.company.companyName() : "",
    isStoreAccount: faker.random.boolean(),
    defaultPercSplit: faker.random.number(100),
    address: faker.address.streetAddress(),
    address2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    zip: faker.address.zipCode(),
    email: faker.internet.email(),
    items: []
  }
}
