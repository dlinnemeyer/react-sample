import {each, isFunction} from 'lodash'
// TODO: need to define a formal sales object schema. the naming below is really inconsistent
// TODO: need to use rounding-sensitive math calculations. or maybe convert everything up to cents
// prior to calculating?

// - DON'T FORGET: CALCULATE FIXED RATE STORE DISCOUNT FOR EACH ITEM BY TAKING RATIO OF ITEM PRICE
// TO TOTAL PRICE, THEN TAKING THAT SAME RATIO OF STORE DISCOUNT (e.g. item has price of $10, subtotal
// is $100, store discount is $20. item takes 10% of store discount, $2)
// - store discount is just a type of discount that doesn't affect consignor portion

/* sale, with little notes

// TODO: not sure if we want to, but there's an abstraction pattern here that's fairly clear.
// Each entity is made up of an original input amount, a set of modifiers, and a final price
// after the modifiers. We also need to grab the change amount and adjusted price after each
// modifier. So a line item is like this:
//   original,
//   discounts: {
//    modifiers: [.. list of objects of the same format],
//    change,
//    amount
//   }
//   taxes: {
//    modifiers,
//    change,
//    amount,
//    dependsOn: "discounts"
//   }
//   surcharges: {
//    modifiers,
//    change,
//    amount,
//    dependsOn: "discounted_price"
//   }
//
//
//
// The problem with this is that we have specific rules on the order these are applied, and sometimes
// whether each modifier in a list passes its value to the next value, or the original, to calculate
// change amount (discounts vs. taxes).
// Certain modifiers branch out, too. So taxes pull from discounts, but split calculations pull
// from discounts, too, not taxes. So its not linear.
// Overall, not sure an abstraction layer is worth it, but it could be. it's close.
//
// We also store meta info with these objects, so they can't *just*
// describe calculations. they have textual info, too.
//
// Also, is a sale really like this? i guess we could say the original is 0, and the subtotal
// is the amount after being adjusted for line items. But there's not a single exit value/return
// for each lineitem. line item calculates consignor portion, store portion, taxed price,
// non-taxed price, etc. so not sure we can really abstract totally without some real problems
//
{
  lineItems: [{
    originalPrice,
    // discounts include item-specific discounts, and merges in global discounts
    discounts: [{
      // we could abstract "value" as a pair of type|amount, but it's not used widely enough to worry
      valueType: percent|fixed,
      value,
      name|note,

      // this field is only renderable from the outside, with a price to take off from. and since
      // order matters, it can't just be a function of the item. it has to be applied in order
      amount
    }],
    tax: {
      name|note,
      rate,

      // renderable with item info. taxes *are* calculated based on pure discountedPrice and don't
      // compound with each other, so this can be pure even with a list of taxes
      amount
    },
    taxExempt, // this just means we don't apply any of the global taxes to this item

    // aggregations based on original price, discounts, taxes, surcharges, etc.
    discountAmount,
    discountedPrice,
    taxAmount,
    taxedPrice,

    surcharges: [{ ....}],
    splitPercent,
    ...textual meta data (title, description, etc.)

  }],
  payments: [{
    type: check|credit_card|etc.,
    amount,
    note,
    checkNumber,
    ... credit card processing junk
  }],

  // globals. these serve as a template and apply to each lineItem, with some potential adjustment
  // (e.g. store discount divied out between items)
  discounts: [{...}],
  taxes: [{...}]

  // aggregated totals. these should all be aggregations of lineItems and payments
  subTotal,
  discountAmount,
  discountedTotal,
  taxAmount,
  taxTotal,
  paymentTotal,
  change,
}
*/

// TODO: can't go with a DSL, because we need full javascript access (e.g. discount orders aren't
// pure, since discount amounts depend on preceding discounts). but we *can* do our best
// to try and still do this declaratively, with object/functions as the basis for the calculations?
// const Sale = {

//   discountedTotal:  ({lineItems}) => sumBy(lineItems, 'discountedPrice'),
//   salesTaxAmount:   ({lineItems}) => sumBy(lineItems, 'taxAmount'),
//   salesTaxTotal:    ({lineItems}) => sumBy(lineItems, 'taxedPrice'),
//   paymentTotal:     ({payments}) => sumBy(lineItems, 'payments'),
//   change:           ({salesTaxTotal, paymentTotal}) => salesTaxTotal + paymentTotal
// }

// TODO: allow for multiple discounts
// const LineItem = ({originalPrice, discount, taxRate, taxExempt}) => ({
//   originalPrice: originalPrice,
//   discounts: [Discount(discount)],
//   discountAmount:   ({discounts}) => sumBy(discounts, "amount"),
//   discountedPrice:  ({originalPrice, discount}) => originalPrice - (originalPrice * discount),
//   taxRate:          ({taxRate, taxExempt}) => taxExempt ? 0 : taxRate,
//   taxAmount:        ({taxExempt, taxRate, discountedPrice}) => {
//                       return taxExempt ? 0 : discountedPrice * (taxRate / 100)
//                     },
//   taxedPrice:       ({discountedPrice, taxAmount}) => discountedPrice - taxAmount
// })

const Discount = ({inputPrice, ...abstractDiscount}) => run({
  inputPrice,
  amount:       ({isFixed, value, inputPrice}) => isFixed ? value : (inputPrice * (value / 100)),
  outputPrice:  ({inputPrice, amount}) => inputPrice - amount,
  ...AbstractDiscount(abstractDiscount)
})

const AbstractDiscount = ({type, value, note}) => run({
  type,
  value,
  note,
  isFixed:          ({type}) => type === 'fixed',
  isPercent:        ({type}) => type === 'percent'
})

// just run any function keys and translate to their values.
// the point of this is to allow us to refer to previous values as we go, but still get the
// clean syntax of object assignment.
// we also bind all the functions to the object, so you can use 'this' with the short arrow syntax.
// ???: Alternatively, we could pass in the object and allow you to descontruct in the
// parameters to state dependencies on other fields, but I think the this syntax is cleaner
// ???: this is probably pretty un-performant, since we re-calculate these objects constantly and
// create all these lambdas. But since these are pure, we could memo-ize them in run()
const run = (obj) => {
  // we actually operate on the object as we go so subsequent functions can just refer to previously
  // calculated values without calling them as functions. we could do this as a reduce, but eh...
  each(obj, (val, key) => {
    if(!isFunction(val)) return
    obj[key] = val(obj)
  })
  return obj
}

console.log(AbstractDiscount({type: "fixed", value: 5, note: "frank"}))
console.log(Discount({type: "fixed", value: 5, note: "frank", inputPrice: 7.5}))

console.log(AbstractDiscount({type: "percent", value: 10, note: "frank"}))
console.log(Discount({type: "percent", value: 10, note: "frank", inputPrice: 7.5}))
