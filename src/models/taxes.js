import {each, last} from 'lodash'
import {run, listOf, Price} from '../lib/declarmath/base'

const _Tax = (config) => ({input, taxable, ...abstractTax}) => ({
  ..._AbstractTax(config, abstractTax),
  input,
  taxable,
  amount:       ({taxable, rate}) => Price(config, taxable * (rate / 100)),
  output:       ({input, amount}) => input + amount
})

Tax({round: myRoundFunc})(....)

const _Tax = ({price, sum}) => ({_AbstractTax}) => ({input, taxable, ...abstractTax}) => ({
  ..._AbstractTax(abstractTax),
  input,
  taxable,

  amount:       price(({taxable, rate}) => taxable * (rate / 100)),
  output:       price(sum('input', 'amount')),
})

_Tax({roundTo5: false, roundTo1: true, blah: () ..})(...)

function _Tax({input, taxable, ...abstractTax}){ return {
  ...AbstractTax(this.config, abstractTax),
  input,
  taxable,
  amount:       ({taxable, rate}) => this.round(taxable * (rate / 100)),
  output:       ({input, amount}) => input + amount
}}

const _AbstractTax = ({rate, name}) => ({
  // anything to do here?
  name,
  rate
})

// return a tax tranform function that properly sets up input/output for each tax, but retains
// the original input as the taxable price
const taxTransform = input => prev => ({input: p ? p.output : input, taxable: input})
const _TaxSet = ({taxes, input}) => ({
  input,
  taxes:        ({input}) => listOf(_Tax)(transform(input))(taxes),
  output:       ({taxes}) => last(taxes).output,
  amount:       ({input, output}) => output - input,
  // in case we want it, the total rate of tax
  rate:         ({input, amount}) => (amount / input) * 100
})

export const Tax = run(_Tax)
export const AbstractTax = run(_AbstractTax)
export const TaxSet = run(_TaxSet)

