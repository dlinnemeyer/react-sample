export function get(id, state){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // TODO: ADD ERROR IF BAD ID
      // random network error
      let err = {};
      if(err = randomNetworkError()){
        reject(err);
        return;
      }

      resolve(state.consignors[id]);
    }, Math.random() * 1000 + 1000);
  });
}
