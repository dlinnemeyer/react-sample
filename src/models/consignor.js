export const displayName = function(consignor){
  return consignor.company
    ? consignor.company
    : consignor.firstName + " " + consignor.lastName;
}

export const linkPath = function(consignor){
  return "/consignors/" + encodeURIComponent(consignor.id);
}
