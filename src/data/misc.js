export function randomNetworkError(){
  // Just change the > 10 bit to change the frequency of errors
  return Math.floor(Math.random() * 10) > 10 ? {code: 99, title: 'server_error'} : null;
}

// just wrap a function in a promise and a settimeout, passing in resolve/reject from the promise
// also, force a potential network error
export function promiseDelay(func){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let err = {};
      if(err = randomNetworkError()){
        reject(err);
        return;
      }

      func(resolve, reject);
    }, randomTime());
  });
}

export function randomTime(){
  return Math.random() * 2000 + 500;
}
