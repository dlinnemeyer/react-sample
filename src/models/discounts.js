import {each, last} from 'lodash'
import {run} from '../lib/declarmath/base'

export const Discount = ({input, ...abstractDiscount}) => run({
  ...AbstractDiscount(abstractDiscount),
  input,
  amount:       ({isFixed, value, input}) => isFixed ? value : (input * (value / 100)),
  output:       ({input, amount}) => input - amount
})

export const AbstractDiscount = ({type, value, note}) => run({
  type,
  value,
  note,
  isFixed:          ({type}) => type === 'fixed',
  isPercent:        ({type}) => type === 'percent'
})

export const DiscountSet = ({discounts, input}) => run({
  input,
  discounts:      ({input}) => calcDiscounts(discounts, input),
  output:         ({discounts}) => last(discounts).output,
  amount:         ({input, output}) => input - output
})

function calcDiscounts(discounts, input){
  const ret = []
  each(discounts, discount => {
    const calculatedDiscount = Discount({
      input,
      ...discount
    })
    ret.push(calculatedDiscount)
    input = calculatedDiscount.output
  })
  return ret
}

