import {last} from 'lodash'
import {run, listOf, price, add, sub} from '../lib/declarmath/base'

const _Tax = ({input, taxable = input, ...abstractTax}) => ({
  ..._AbstractTax(abstractTax),
  input,
  taxable,
  // taxable:      isUndefined(taxable) ? input : taxable,
  amount:       ({taxable, rate}) => price(taxable * (rate / 100)),
  output:       price(add('input', 'amount'))
})

const _AbstractTax = ({rate, name}) => ({
  // anything to do here?
  name,
  rate
})

// return a tax tranform function that properly sets up input/output for each tax, but retains
// the original input as the taxable price
const transform = (input, taxable) => prev => ({input: prev ? prev.output : input, taxable})
const _TaxSet = ({taxes, input, taxable = input}) => ({
  input,
  taxable,
  taxes:        listOf(_Tax)(transform(input, taxable))(taxes),
  output:       ({taxes, input}) => taxes.length ? last(taxes).output : input,
  amount:       price(sub('output', 'input')),
  // in case we want it, the total rate of tax
  rate:         ({input, amount}) => (amount / input) * 100
})

export const Tax = run(_Tax)
export const AbstractTax = run(_AbstractTax)
export const TaxSet = run(_TaxSet)

