import {each, last} from 'lodash'
import {run, listOf, price} from '../lib/declarmath/base'

const _Discount = ({input, ...abstractDiscount}) => ({
  ..._AbstractDiscount(abstractDiscount),
  input:        price(input),
  amount:       ({isFixed, value, input}) => price(isFixed ? value : (input * (value / 100))),
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
  output:         ({discounts, input}) => discounts.length ? last(discounts).output : input,
  amount:         ({input, output}) => input - output
})

export const Discount = run(_Discount)
export const AbstractDiscount = run(_AbstractDiscount)
export const DiscountSet = run(_DiscountSet)
