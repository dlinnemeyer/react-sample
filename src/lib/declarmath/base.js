import {isFunction, each} from 'lodash'

// just run any function keys and translate to their values.
// the point of this is to allow us to refer to previous values as we go, but still get the
// clean syntax of object assignment.
// we also bind all the functions to the object, so you can use 'this' with the short arrow syntax.
// ???: Alternatively, we could pass in the object and allow you to descontruct in the
// parameters to state dependencies on other fields, but I think the this syntax is cleaner
// ???: this is probably pretty un-performant, since we re-calculate these objects constantly and
// create all these lambdas. But since these are pure, we could memo-ize them in run()
export function run(obj){
  // we actually operate on the object as we go so subsequent functions can just refer to previously
  // calculated values without calling them as functions. we could do this as a reduce, but eh...
  const ret = {}
  each(obj, (val, key) => {
    ret[key] = isFunction(val) ? val(ret) : val
  })
  return ret
}
