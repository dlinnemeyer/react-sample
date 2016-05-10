export const displayName = function(item){
  // get all non-empty values for the optional fields
  const extras = ['brand', 'color', 'size'].map(f => item[f]).filter(v => v && v.length > 0)

  let extraString = ""
  if(extras.length > 0){
    extraString = ` (${extras.join(" ")})`
  }
  return `${item.title} ${extraString} [#${item.sku}]`
}

export const linkPath = function(item){
  return `/items/${encodeURIComponent(item.id)}`
}


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
