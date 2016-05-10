export function error(id, message){
  return {
    type: "ERROR",
    id,
    message
  }
}
