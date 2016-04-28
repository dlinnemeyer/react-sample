import * as consignors from "../data/consignors"
import {globalErrorize} from "./misc"
import faker from "faker"

export function addConsignor(consignor){
  return (dispatch, getStore) => {
    // We don't bother with error handling on this promise. We don't have any global error handling
    // to do, and components actually calling this action can catch errors.
    // Or should we find a way to defer a global error handling? Somehow only run it if nothing
    // else handles the error?
    return consignors.add(consignor, getStore())
      .then(consignor => {
        dispatch(addConsignorAction(consignor));
        // in case anyone else is chaining on this? though they probably shouldn't, since
        // everything else should flow through redux actions/reducers?
        return consignor;
      })
      .catch(globalErrorize(dispatch));
  }
}

export function deleteConsignor(consignor){
  return (dispatch, getStore) => {
    return consignors.del(consignor)
      .then(consignor => {
        dispatch(deleteConsignorAction(consignor));
        return consignor;
      })
      .catch(globalErrorize(dispatch));
  }
}

export function loadConsignors(ids){
  return (dispatch, getStore) => {
    return consignors.getAll(ids)
      .then(consignors => {
        dispatch(loadConsignorsAction(consignors));
        return consignors;
      })
      .catch(globalErrorize(dispatch));
  }
}

export function addFakeConsignors(num = 50){
  const newConsignors = {};
  let i = 0;
  while(num > i){
    let consignor = fakeConsignor();
    newConsignors[consignor.id] = consignor;
    i++;
  }
  consignors.__setConsignors(Object.assign({},
    consignors.__getConsignors(),
    newConsignors
  ));

  return loadConsignorsAction(newConsignors);
}

export function deleteAllConsignors(){
  return dispatch => {
    const all = consignors.__getConsignors();
    consignors.__setConsignors({});
    Object.keys(all).forEach(cid => dispatch(deleteConsignorAction(all[cid])));
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

// not sure what to call this? it's the pure action generator, as opposed to the thunk-ified one
// we actually call from our code
// should we really distinguish between adding a new consignor and loading new consignors into
// state?
function addConsignorAction(consignor){
  return { type: 'ADD_CONSIGNOR', consignor }
}

function deleteConsignorAction(consignor){
  return { type: 'DELETE_CONSIGNOR', consignor }
}

function loadConsignorsAction(consignors){
  return { type: 'LOAD_CONSIGNORS', consignors }
}
