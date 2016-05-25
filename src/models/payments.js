import {sumBy} from 'lodash'
import {run, listOf, price} from '../lib/declarmath/base'

const _Payment = ({type, amount, ...meta}) => ({
  ...meta, // payments can have different meta info depending on payment type
  type,
  amount:   price(amount)
})

const _PaymentSet = ({payments}) => ({
  payments:   listOf(_Payment)()(payments),
  amount:     ({payments}) => sumBy(payments, 'amount')
})

export const Payment = run(_Payment)
export const PaymentSet = run(_PaymentSet)
