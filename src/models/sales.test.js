import {assert} from 'chai'
import {Sale} from './sales'
import {LineItemSet} from './lineitems'
import {PaymentSet} from './payments'
import {AbstractDiscount} from './discounts'

describe('Sales', () => {
  describe('Sale', () => {

    it('should calculate a basic sale', () => {
      const rawSale = {
        lineItems: [
          {listPrice: 1895, discounts: [{type: 'percent', value: 20}], taxes: [{rate: 10}]},
          {listPrice: 1334, discounts: [{type: 'fixed', value: 100}], taxes: [{rate: 10}]}
        ],
        payments: [
          {type: 'check', amount: 2500},
          {type: 'credit card', amount: 700}
        ]
      }
      assert.deepEqual(Sale(rawSale),{
        lineItems: LineItemSet({lineItems: rawSale.lineItems}),
        discountAmount: 479,
        subtotal: 2750,
        taxes: 275,
        taxedTotal: 3025,

        payments: PaymentSet({payments: rawSale.payments}),
        paymentTotal: 3200,
        change: 175
      })
    })

    it('should properly apply global discounts', () => {
      const rawSale = {
        lineItems: [
          {listPrice: 2200, discounts: [{type: 'percent', value: 20}], taxes: [{rate: 10}]},
          {listPrice: 1500, discounts: [{type: 'fixed', value: 100}], taxes: [{rate: 5}]}
        ],
        discounts: [
          {type: 'percent', value: 10, name: 'somesale'},
          {type: 'fixed', value: 500, name: 'someothersale'}
        ],
        payments: [
          {type: 'check', amount: 2500},
          {type: 'credit card', amount: 700}
        ]
      }
      assert.deepEqual(Sale(rawSale),{
        lineItems: LineItemSet({lineItems: rawSale.lineItems, discounts: rawSale.discounts}),
        liDiscountAmount: 540,
        discounts: rawSale.discounts.map(AbstractDiscount),
        globalDiscountAmount: 816,
        discountAmount: 1356,
        subtotal: 2344,
        taxes: 131 + 52,
        taxedTotal: 2344 + 131 + 52,

        payments: PaymentSet({payments: rawSale.payments}),
        paymentTotal: 3200,
        change: 3200 - (2344 + 131 + 52)
      })
    })

  })
})
