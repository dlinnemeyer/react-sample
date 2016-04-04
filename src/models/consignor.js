export const displayName = function(consignor){
  return consignor.get("company")
    ? consignor.get("company")
    : consignor.get("firstName") + " " + consignor.get("lastName");
}

export const linkPath = function(consignor){
  return "/consignors/" + encodeURIComponent(consignor.get("id"));
}
