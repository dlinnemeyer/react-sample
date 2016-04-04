export const displayName = function(item){
  // get all non-empty values for the optional fields
  let extras = ['brand', 'color', 'size'].map(f => item.get(f)).filter(v => v.length > 0);

  let extraString = "";
  if(extras.length > 0){
    extraString = ` (${extras.join(" ")})`;
  }
  return item.get("title") + extraString;
}

export const linkPath = function(item){
  return "/items/" + encodeURIComponent(item.get("id"));
}
