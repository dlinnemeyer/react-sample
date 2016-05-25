import {assert} from 'chai'
import {LineItem, LineItemSet} from './lineitems'
import {DiscountSet} from './discounts'
import {TaxSet} from './taxes'

describe('LineItems', () => {
  describe('LineItem', () => {

    it('should calculate a basic line item', () => {
      assert.deepEqual(LineItem({title: 'some title', listPrice: 353, percentSplit: 43}),{
        title: 'some title',
        listPrice: 353,
        percentSplit: 43,
        customerSurcharge: 0,
        receiptPrice: 353,

        discountSet: DiscountSet({discounts: [], input: 353}),
        discountAmount: 0,
        discountedPrice: 353,

        taxSet: TaxSet({taxes: [], input: 353}),
        taxAmount: 0,
        taxedPrice: 353,

        nonTaxedPrice: 353,
        total: 353,

        grossSplitPrice: 353,
        netSplitPrice: 353,
        percentSplit: 43,
        grossConsignorPortion: 152,
        consignorSurcharge: 0,
        netConsignorPortion: 152,
        grossStorePortion: 201,
        netStorePortion: 201
      })
    })

    it('should calculate a line item with the fixins', () => {
      const rawLineItem = {
        title: 'some title',
        description: 'description',
        listPrice: 353,
        customerSurcharge: 100,
        discounts: [{value: 50, type: 'fixed'}, {value: 10, type: 'percent'}],
        taxes: [{rate: 4}, {rate: 6}],
        percentSplit: 56.4,
        consignorSurcharge: 30
      }
      assert.deepEqual(LineItem(rawLineItem), {
        title: 'some title',
        description: 'description',
        listPrice: 353,
        customerSurcharge: 100,
        receiptPrice: 453,

        discountSet: DiscountSet({discounts: rawLineItem.discounts, input: 453}),
        discountAmount: 90,
        discountedPrice: 363,

        taxSet: TaxSet({taxes: rawLineItem.taxes, input: 363}),
        taxAmount: 37,
        taxedPrice: 400,

        nonTaxedPrice: 363,
        total: 400,

        grossSplitPrice: 363,
        netSplitPrice: 263,
        percentSplit: 56.4,
        grossConsignorPortion: 148,
        consignorSurcharge: 30,
        netConsignorPortion: 118,
        grossStorePortion: 115,
        netStorePortion: 115
      })

    })
  })

  describe('LineItemSet', () => {

    it('should handle an empty lineitem list', () => {
      assert.deepEqual(LineItemSet({lineItems: []}), {
        lineItems: [],
        discountAmount: 0,
        discountedTotal: 0,
        taxAmount: 0,
        taxedTotal: 0
      })
    })

    it('should handle a couple lineitems', () => {
      const rawLineItems = [
        {listPrice: 500, discounts: [{type: 'fixed', value: 200}], taxes: [{rate: 5.5}]},
        {listPrice: 1000, discounts: [{type: 'percent', value: 50}], taxes: [{rate: 10}]},
      ]
      assert.deepEqual(LineItemSet({lineItems: rawLineItems}),{
        lineItems: rawLineItems.map(LineItem),
        discountAmount: 700,
        discountedTotal: 800,
        taxAmount: 67,
        taxedTotal: 867
      })
    })
  })
})
