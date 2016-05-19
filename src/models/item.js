import {PropTypes} from 'react'

export const displayName = function(item){
  // get all non-empty values for the optional fields
  const extras = ['brand', 'color', 'size'].map(f => item[f]).filter(v => v && v.length > 0)

  let extraString = ""
  if(extras.length > 0){
    extraString = ` (${extras.join(" ")})`
  }
  return `${item.title} ${extraString} [#${item.sku}]`
}

export function linkPath(item, type = "view"){
  let append
  switch(type){
    case 'view':
      append = ""
      break
    case 'edit':
      append = "/edit"
      break
  }
  return `/items/${encodeURIComponent(item.id)}${append}`
}

export const propType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sku: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  percSplit: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  printed: PropTypes.bool.isRequired,
  consignorid: PropTypes.string.isRequired
})

// this probably shouldn't be here? the other two functions operate on individual consignor models.
// this function is a function of state, though. Maybe a file or directory of state helper retrieval
// functions would be nice? In that case, reducers/actions are what we use to manipulate state,
// and state helpers would be for data retrieval (getters)?
export function get(state, id){
  return state.items[id]
}
export function getAll(state, ids){
  return ids.map(id => state.items[id]).filter(item => !!(item))
}
