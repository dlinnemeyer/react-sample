import {reduce, isFunction, each, round, isObjectLike, isNumber, isArray, last, flow} from 'lodash'

// helpers
// todo: Its own file?

// listOf is for use cases where you want an array of models back from an array of input values,
// but each model depends on data from the previously-calculated model (e.g. discounts needing
// the output of the previous discount as the input of the next discount).
// give it a model function, a pipe function, and an array of data
export const listOf = Model => pipe => list => {
  // we're returning a list of functions, so they get calculated later when we actually run through
  // everything with calculate()
  // when calculating arrays of functions, we pass in the so-far-calculated items to each function
  // in calculate() below, which is what calculated is here
  return list.map(item => calculated => {
    return Model({...item, ...pipe(last(calculated))})
  })
}

// just rounds the returned value to an integer. this enforces prices stored as cents, not as floats
// price can take functions or values
export const price = mixed => {
  return isFunction(mixed) ? flow(mixed, closest1) : closest1(mixed)
}

// basic stuff. just works on objects. and I guess arrays? not sure that's a good idea though
export const id = a => obj => obj[a]
export const add = (a,b) => obj => obj[a] + obj[b]
export const sub = (a,b) => obj => obj[a] - obj[b]
export const mul = (a,b) => obj => obj[a] * obj[b]
export const div = (a,b) => obj => obj[a] / obj[b]

// rounding function builder. takes any increment, like '5' to round to nearest 5
// for prevision rounding, just used lodash's rounding function
export const closest = inc => num => isNumber(num) ? round(num / inc) * inc : num
const closest1 = closest(1)
const closest5 = closest(5)



// wrap a function with calculate, so the user always gets fully calculated values
// TODO: we could memoize in this wrapper function? this objects are pure functions, so
// func + args should always give back the same answer
export const run = func => flow(func, calculate)


// dig through data recursively, find functions, and call them.
// for each object, as keys are processed, pass them into functions so they can pull from
// prior-calculated values
const calculate = (val, state = {}) => {
  if(isArray(val)){
    return collectionCalc(val)
  }
  if(isObjectLike(val)){
    // have to do a reduce here so we can track with the state as we process the object
    // we built a new state for the nested objects so they remain pure
    return collectionCalc(val)
  }
  if(isFunction(val)){
    // run calculate on the result. this way if the function returns an object, we can
    // resolve that object's functions, too.
    return calculate(val(state), state)
  }

  // scalar values remaining, so just return them
  return val
}

const collectionCalc = (coll) => {
  const initial = isArray(coll) ? [] : {}
  return reduce(coll, (state, val, key) => {
    state[key] = calculate(val, state)
    return state
  }, initial)
}
