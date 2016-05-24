import {each, isFunction} from 'lodash'

const Tax = ({inputPrice, taxablePrice,...abstractTax}) => run({
  ...AbstractTax(abstractTax),
  inputPrice,
  taxablePrice,
  amount:       ({taxablePrice, rate}) => taxablePrice* rate,
  outputPrice:  ({inputPrice, amount}) => inputPrice + amount
})

const AbstractTax = ({rate, name}) => run({
  // anything to do here?
  name,
  rate
})

const TaxSet = ({taxes, inputPrice}) => run({
  inputPrice,
  taxes:        ({inputPrice}) => calcTaxes(taxes, inputPrice),
  outputPrice:  ({taxes}) => last(taxes).outputPrice,
  amount:       ({inputPrice, outputPrice}) => outputPrice - inputPrice,
  // in case we want it, the total rate of tax
  rate:         ({inputPrice, amount}) => amount / inputPrice
})

function calcTaxes(taxes, input){
  const ret = []
  const taxablePrice = input
  each(taxes, tax => {
    const calculatedTax = Tax({
      inputPrice: input,
      taxablePrice,
      ...tax
    })
    ret.push(calculatedTax)
    input = calculatedTax.outputPrice
  })
  return ret
}

const LineItem = ({listPrice, custSurcharge, discounts, taxes, percSplit, conSurcharge, ...meta}) => run({
  ...meta, //title, description, silly stuff like that

  // basics
  listPrice,
  // TODO: make custSurcharge a SurchargeSet that includes customer and credit card surcharge
  custSurcharge,
  receiptPrice:       ({listPrice, custSurcharge}) => listPrice + custSurcharge,

  // discounts
  // TODO: store vs. normal
  discountSet:        ({inputPrice}) => DiscountSet({discounts, inputPrice}),
  discountAmount:     ({discountSet}) => discountSet.amount,
  discountedPrice:    ({discountSet}) => discountSet.outputPrice,

  // taxes
  // TODO: inclusive vs. exclusive
  taxSet:             ({discountedPrice}) => TaxSet({taxes, discountedPrice}),
  taxAmount:          ({taxSet}) => taxSet.amount,
  taxedPrice:         ({taxSet}) => taxSet.outputPrice,

  // various clarifying totals
  // TODO: nonTaxPrice will have to be different once we add exclusive taxes
  nonTaxPrice:        ({discountedPrice}) => discountedPrice,
  total:              ({taxedPrice}) => taxedPrice,

  // split calculations. hold onto your butts...
  // TODO: once we add store discounts, grossSplitPrice should be nonTaxPrice + storeDiscountAmount
  grossSplitPrice:    ({nonTaxPrice}) => nonTaxPrice,
  // TODO: when we add surcharge as a set, need custSurcharge.amount
  netSplitPrice:      ({grossSplitPrice, custSurcharge}) => grossSplitPrice - custSurcharge,
  percSplit,
  grossConPortion:    ({percSplit, netSplitPrice}) => netSplitPrice * percSplit,
  // TODO: we'll need to allow a list of consignor surcharges
  netConPortion:      ({grossConPortion, conSurcharge}) => grossConPortion - conSurcharge,
  grossStorePortion:  ({netSplitPrice, grossConPortion}) => netSplitPrice - grossConPortion,
  // TODO: subtract store discounts to get netStorePortion
  netStorePortion:    ({grossStorePortion}) => grossStorePortion,
})
