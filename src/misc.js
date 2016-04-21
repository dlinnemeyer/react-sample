export function arrToHash(arr, key = "id"){
  return arr.reduce((obj, x) => {
    if(!x) return obj;

    obj[x[key]] = x;
    return obj;
  }, {});
}
