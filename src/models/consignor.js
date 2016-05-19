import {PropTypes} from 'react'

export function displayName(consignor){
  return consignor.company
    ? consignor.company
    : `${consignor.firstName} ${consignor.lastName}`
}

export function linkPath(consignor, type = "view"){
  let append
  switch(type){
    case 'view':
      append = ""
      break
    case 'edit':
      append = "/edit"
      break
  }
  return `/consignors/${encodeURIComponent(consignor.id)}${append}`
}

export const propType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  isStoreAccount: PropTypes.bool.isRequired,
  defaultPercSplit: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired
})


// this probably shouldn't be here? the other two functions operate on individual consignor models.
// this function is a function of state, though. Maybe a file or directory of state helper retrieval
// functions would be nice? In that case, reducers/actions are what we use to manipulate state,
// and state helpers would be for data retrieval (getters)?
export function get(state, id){
  return state.consignors[id]
}
