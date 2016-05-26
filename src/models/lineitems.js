import {sumBy} from 'lodash'
import {run, price, listOf} from '../lib/declarmath/base'
import {TaxSet} from './taxes'
import {DiscountSet} from './discounts'

// Line Items are tough because in applying global fixed discounts, we have to distribute those
// discounts amoung all items. But they have to be distributed based on post-line-item-discount
// ratios and before taxes (since discount amounts aren't taxable).
// This means we have to calculate up to line-item-discount level, then step back out, calculate
// ratios for the whole list, then step back into each line item to apply distributed global
// discounts, taxes, and calculate splits.
// This means line item calculations aren't pure; they have to know about each other (or be passed
// their ratio of the discounted subtotal). So solve this, we broke the different portions of line
// item calculations into separate functions, each of which is responsible for a single step
// in the calculations. We merge them together in the end to create the complete line item model.

const _Discounted = ({listPrice = 0, customerSurcharge = 0, discounts = [], ...other}) => ({
  ...other, // for meta info. also for fields that will be used later in _GlobalDiscounted

  // basics
  listPrice:              price(listPrice),
  // TODO: make custSurcharge a SurchargeSet that includes customer and credit card surcharge
  customerSurcharge:      price(customerSurcharge),
  receiptPrice:           o => o.listPrice + o.customerSurcharge,

  // discounts
  // TODO: store vs. normal
  discountSet:            o => DiscountSet({discounts, input: o.receiptPrice}),
  discountAmount:         o => o.discountSet.amount,
  discountedPrice:        o => o.discountSet.output
})

// take a _Discounted line item and apply more discounts
// also handles the rest of the operations, since we don't have to step out of the list anymore
// at this point. we could split this more into _Taxed, and _Split, which might be nice, but I'll
// save that for later
const _GlobalDiscounted = ({receiptPrice, globalDiscounts = [], taxes = [], percentSplit = 0, consignorSurcharge = 0, ...Discounted}) => ({
  ...Discounted,

  globalDiscountSet:      o => DiscountSet({discounts: globalDiscounts, input: o.discountedPrice}),
  globalDiscountAmount:   o => o.globalDiscountSet.amount,
  globalDiscountedPrice:  o => o.globalDiscountSet.output,

  // taxes
  // TODO: inclusive vs. exclusive
  taxSet:                 o => TaxSet({taxes, input: o.globalDiscountedPrice}),
  taxAmount:              o => o.taxSet.amount,
  taxedPrice:             o => o.taxSet.output,

  // various clarifying totals
  // TODO: nonTaxPrice will have to be different once we add exclusive taxes
  nonTaxedPrice:          o => o.globalDiscountedPrice,
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


// take an array of global discounts, an array of line items, and a subtotal, and returns a list
// of lineItems with globals added
const distributeGlobals = (globalDiscounts, lineItems, subtotal) => {
  return globalDiscounts.map(discount => distributeGlobal(discount, lineItems, subtotal))
}
const distributeGlobal = (discount, lineItems, subtotal) => {
  // percent discounts don't change at all
  if(discount.type == 'percent') return lineItems.map(() => discount)

  // and now the cause for all this mess: distributing fixed discounts based on ratio
  let remainder = discount.value
  return lineItems.map((lineItem, i) => {
    const value = (lineItems.length - 1) == i
      // grab the remaining if we're on the last item so we don't leave hanging pennies
      ? remainder
      // make sure to round here, so we're distributing by the penny
      : price(remainder * (lineItem.discountedPrice / subtotal))

    remainder -= value
    return {type: 'fixed', value}
  })
}

// takes discounted line items and distributed globals and gives back rendered line items
const applyGlobalDiscounts = (lineItems, distributedGlobals) => {
  return lineItems.map((li, i) => {
    // global discounts should be ordered the same as lineItems, so form an array of discounts
    // by selected based on index from distributedGlobals
    const globalDiscounts = distributedGlobals.map(discounts => discounts[i])
    return _GlobalDiscounted({...li, globalDiscounts})
  })
}


// to calculate discounts
// - calculate DiscountedLineItems, which calculates the line-item-specific discounts
// - calculate discountedSubtotal
// - calculate GlobalDiscountedLineItems, which add global discounts.
//    take discountedSubtotal, DiscountedLineItems, and global discounts. alter global fixed
//    discounts by allocating by % of discountedSubtotal. Make sure the last item "uses up" the
//    remainder of the fixed amount.
// - calculate lineItems, which takes globaldiscountedlineitems and adds taxes and split calculations

const _LineItemSet = ({lineItems, globalDiscounts = [], taxes = []}) => ({
  discounted:             lineItems.map(_Discounted),
  discountAmount:         o => sumBy(o.discounted, 'discountAmount'),
  discountedTotal:        o => sumBy(o.discounted, 'discountedPrice'),

  distributedGlobals:     o => distributeGlobals(globalDiscounts, o.discounted, o.discountedTotal),
  globalDiscounted:       o => applyGlobalDiscounts(o.discounted, o.distributedGlobals),
  globalDiscountAmount:   o => sumBy(o.globalDiscounted, 'globalDiscountAmount'),
  globalDiscountedTotal:  o => sumBy(o.globalDiscounted, 'globalDiscountedPrice'),

  lineItems:              o => o.globalDiscounted,
  taxAmount:              o => sumBy(o.lineItems, 'taxAmount'),
  taxedTotal:             o => sumBy(o.lineItems, 'taxedPrice'),
})

export const Discounted = run(_Discounted)
export const GlobalDiscounted = run(_GlobalDiscounted)
export const LineItemSet = run(_LineItemSet)
