import {each, last} from 'lodash'
import {run, listOf} from '../lib/declarmath/base'

// TODO: DiscountList is clunky, it seems, but mainly because it introduces the concept of an array
// with pre-calculations rather than an object. and it's mainly there because DiscountSet can't
// pre-maturely force calculations on each child Discount Object, so it can grab each output
// and pass it in as the next Discount's input itself, when it's first called.
// If we wanted to allow model functions to force calculations on child models, but still make
// them unaware of postProcess functions, we could change their form to first take a calculate
// function. that calculate function could be created in the run() context based on the postprocess,
// and it'd just be a cleaner wrapper of calculate() (without the postProcess first param).
// Like so:
/*
const _DiscountSet = calculate => ({discounts, input}) => ({
  input,
  discounts:  ({input}) => calcDiscounts(discounts, input, calculate),
  ...
})

function calcDiscounts(discounts, input, calculate){
  const ret = []
  each(discounts, discount => {
    const calculatedDiscount = calculate(_Discount({
      input,
      ...discount
    }))
    ret.push(calculatedDiscount)
    input = calculatedDiscount.output
  })
  return ret
}
*/

const _Discount = ({input, ...abstractDiscount}) => ({
  ..._AbstractDiscount(abstractDiscount),
  input,
  amount:       ({isFixed, value, input}) => isFixed ? value : (input * (value / 100)),
  output:       ({input, amount}) => input - amount
})

const _AbstractDiscount = ({type, value, note}) => ({
  type,
  value,
  note,
  isFixed:          type === 'fixed',
  isPercent:        type === 'percent'
})

const _DiscountSet = ({discounts, input}) => ({
  input,
  discounts:      ({input}) => listOf(_Discount)(p => ({input: p ? p.output : input}))(discounts),
  output:         ({discounts}) => last(discounts).output,
  amount:         ({input, output}) => input - output
})

export const Discount = run(_Discount)
export const AbstractDiscount = run(_AbstractDiscount)
export const DiscountSet = run(_DiscountSet)
