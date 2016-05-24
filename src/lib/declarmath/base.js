import {reduce, isFunction, each, round, isObjectLike, isNumber, isArray, last} from 'lodash'

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


// take a function. return a function that first takes a postProcessing function and returns the
// original function, wrapped in calculateObject. The postProcessing function is run on every
// key returned by calculateObject.
// TODO: we could memoize in this wrapper function? this objects are pure functions, so
// func + postProcess + args should always give back the same answer
export const run = func => {
  return (postProcess = closest1) => (...args) => calculate(postProcess, func(...args))
}

// rounding function builder. takes any increment, like '5' to round to nearest 5
// for prevision rounding, just used lodash's rounding function
export const closest = inc => num => isNumber(num) ? round(num / inc) * inc : num
const closest1 = closest(1)
const closest5 = closest(5)

// dig through data recursively, find functions, and call them.
// for each object, as keys are processed, pass them into functions so they can pull from
// prior-calculated values
const calculate = (postProcess, val, key, state = {}) => {
  if(isArray(val)){
    return collectionCalc(postProcess, val)
  }
  if(isObjectLike(val)){
    // have to do a reduce here so we can track with the state as we process the object
    // we built a new state for the nested objects so they remain pure
    return collectionCalc(postProcess, val)
  }
  if(isFunction(val)){
    // run calculate on the result. this way if the function returns an object, we can
    // resolve that object's functions, too. it also leaves postProcess running to re-running
    // calculate
    return calculate(postProcess, val(state), key, state)
  }

  // scalar values remaing, so we can run postprocess on those
  return postProcess(val, key, state)
}

const collectionCalc = (postProcess, coll) => {
  const initial = isArray(coll) ? [] : {}
  return reduce(coll, (state, val, key) => {
    state[key] = calculate(postProcess, val, key, state)
    return state
  }, initial)
}
