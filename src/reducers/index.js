import items from './items'
import consignors from './consignors'
import loading from './loading'
import error from './error'

// just export the object of reducer functions. we'll call combineReducers in index.jsx so we can
// add global reducers from plugins
export default {
  consignors,
  items,
  loading,
  error
}
