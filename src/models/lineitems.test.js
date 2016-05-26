import {assert} from 'chai'
import {Discounted, GlobalDiscounted, LineItemSet} from './lineitems'
import {DiscountSet} from './discounts'
import {TaxSet} from './taxes'

describe('LineItems', () => {
  describe('Discounted', () => {
    it('should calculate a basic line item', () => {
    })

    it('should calculate some discounts', () => {
    })
  })

  describe('GlobalDiscounted', () => {
    it('should calculate a basic line item', () => {
    })

    it('should calculate some discounts', () => {
    })
  })

  // TODO add tests for Taxed, and Split

  // since we've tested other functionality above, we mainly just need to test globalDiscounts
  // for line item sets, and the derived aggregate values
  describe('LineItemSet', () => {

    it('should handle an empty lineitem list', () => {
      assert.deepEqual(LineItemSet({lineItems: []}), {
        discounted: [],
        discountAmount: 0,
        discountedTotal: 0,

        distributedGlobals: [],
        globalDiscounted: [],
        globalDiscountAmount: 0,
        globalDiscountedTotal: 0,

        lineItems: [],
        taxAmount: 0,
        taxedTotal: 0
      })
    })

    it('should handle a couple lineitems with no global discounts or taxes', () => {
      const rawLineItemSet = {
        lineItems: [
          {listPrice: 500, discounts: [{type: 'fixed', value: 200}], taxes: [{rate: 5.5}]},
          {listPrice: 1000, discounts: [{type: 'percent', value: 50}], taxes: [{rate: 10}]},
        ],
        globalDiscounts: [],
        taxes: []
      }
      const discounted = rawLineItemSet.lineItems.map(Discounted)
      const globalDiscounted = discounted.map(GlobalDiscounted)
      assert.deepEqual(LineItemSet(rawLineItemSet),{
        discounted,
        discountAmount: 700,
        discountedTotal: 800,

        distributedGlobals: [],
        globalDiscounted,
        globalDiscountAmount: 0,
        globalDiscountedTotal: 800,

        lineItems: globalDiscounted,
        taxAmount: 67,
        taxedTotal: 867
      })
    })

    it('should handle a couple lineitems with global discounts', () => {
      const rawLineItemSet = {
        lineItems: [
          {listPrice: 500, discounts: [{type: 'fixed', value: 200}], taxes: [{rate: 5.5}]},
          {listPrice: 1000, discounts: [{type: 'percent', value: 50}], taxes: [{rate: 10}]},
        ],
        globalDiscounts: [
          {type: 'percent', value: 10},
          {type: 'fixed', value: 250}
        ],
        taxes: []
      }
      const discounted = rawLineItemSet.lineItems.map(Discounted)
      const distributedGlobals = [
        [{type: 'percent', value: 10}, {type: 'percent', value: 10}],
        [{type: 'fixed', value: 94}, {type: 'fixed', value: 156}]
      ]
      const globalDiscounted = discounted.map((li, i) => {
        return GlobalDiscounted({...li, globalDiscounts: distributedGlobals.map(a => a[i])})
      })

      assert.deepEqual(LineItemSet(rawLineItemSet),{
        discounted,
        discountAmount: 700,
        discountedTotal: 800,

        distributedGlobals,
        globalDiscounted,
        globalDiscountAmount: 330,
        globalDiscountedTotal: 470,

        lineItems: globalDiscounted,
        taxAmount: 39,
        taxedTotal: 509
      })
    })

    it('should handle a couple lineitems with global discounts and taxes', () => {
    })

  })
})
