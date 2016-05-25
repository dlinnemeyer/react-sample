import {run, price} from '../lib/declarmath/base'
import {TaxSet} from './taxes'
import {DiscountSet} from './discounts'

const _LineItem = ({listPrice = 0, customerSurcharge = 0, discounts = [], taxes = [], percentSplit = 0, consignorSurcharge = 0, ...meta}) => ({
  ...meta, //title, description, silly stuff like that

  // basics
  listPrice:              price(listPrice),
  // TODO: make custSurcharge a SurchargeSet that includes customer and credit card surcharge
  customerSurcharge:      price(customerSurcharge),
  receiptPrice:           o => o.listPrice + o.customerSurcharge,

  // discounts
  // TODO: store vs. normal
  discountSet:            o => DiscountSet({discounts, input: o.receiptPrice}),
  discountAmount:         o => o.discountSet.amount,
  discountedPrice:        o => o.discountSet.output,

  // taxes
  // TODO: inclusive vs. exclusive
  taxSet:                 o => TaxSet({taxes, input: o.discountedPrice}),
  taxAmount:              o => o.taxSet.amount,
  taxedPrice:             o => o.taxSet.output,

  // various clarifying totals
  // TODO: nonTaxPrice will have to be different once we add exclusive taxes
  nonTaxedPrice:          o => o.discountedPrice,
  total:                  o => o.taxedPrice,

  // split calculations. hold onto your butts...
  // TODO: once we add store discounts, grossSplitPrice should be nonTaxPrice + storeDiscountAmount
  grossSplitPrice:        o => o.nonTaxedPrice,
  // TODO: when we add surcharge as a set, need custSurcharge.amount
  netSplitPrice:          o => o.grossSplitPrice - o.customerSurcharge,
  percentSplit,
  grossConsignorPortion:  o => price(o.netSplitPrice * (o.percentSplit / 100)),
  consignorSurcharge:     price(consignorSurcharge),
  // TODO: we'll need to allow a list of consignor surcharges
  netConsignorPortion:    o => o.grossConsignorPortion - o.consignorSurcharge,
  grossStorePortion:      o => o.netSplitPrice - o.grossConsignorPortion,
  // TODO: subtract store discounts to get netStorePortion
  netStorePortion:        o => o.grossStorePortion
})

export const LineItem = run(_LineItem)
