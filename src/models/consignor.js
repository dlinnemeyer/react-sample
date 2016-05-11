export function displayName(consignor){
  return consignor.company
    ? consignor.company
    : `${consignor.firstName} ${consignor.lastName}`
}

export function linkPath(consignor){
  return `/consignors/${encodeURIComponent(consignor.id)}`;
}


// this probably shouldn't be here? the other two functions operate on individual consignor models.
// this function is a function of state, though. Maybe a file or directory of state helper retrieval
// functions would be nice? In that case, reducers/actions are what we use to manipulate state,
// and state helpers would be for data retrieval (getters)?
export function get(state, id){
  return state.consignors[id]
}
