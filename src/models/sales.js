import {each, isFunction} from 'lodash'
import {run, listOf, price} from '../lib/declarmath/base'
import {LineItemSet} from './lineitems'
import {PaymentSet} from './payments'

const _Sale = ({lineItems, payments}) => ({
  lineItems:      LineItemSet({lineItems}),
  discountAmount: o => o.lineItems.discountAmount,
  subtotal:       o => o.lineItems.discountedTotal,
  taxes:          o => o.lineItems.taxAmount,
  taxedTotal:     o => o.lineItems.taxedTotal,

  payments:       PaymentSet({payments}),
  paymentTotal:   o => o.payments.amount,
  change:         o => o.paymentTotal - o.taxedTotal
})

export const Sale = run(_Sale)
