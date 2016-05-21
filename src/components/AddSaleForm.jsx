import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'
import {reduxFormPropTypes} from '../misc'
import {fromForm as saleFromForm} from '../models/sales'

// keep in mind, this should only summarize the actual input fields, not all the computed values.
// we'll need to define a sale object model, and we'll need functions to convert from sale to
// form values, and from form values back out to a sale object.
// We'll also need to be able to validate the form fields themselves, not just the computed
// sale object
const fields = [
  "salesTax",
  "lineItems[].id",
  "lineItems[].sku",
  "lineItems[].originalPrice",
  "lineItems[].title",
  "lineItems[].discount",
  "lineItems[].taxExempt",
  "payments[].type",
  "payments[].amount",
  "payments[].checkNumber"
]

const LineItem = React.createClass({
  render(){
    const {
      fields: { id, sku, originalPrice, title, discount, taxExempt },
      calculated: { discountedPrice }
    } = this.props
    return <div>
      <input type="hidden" {...id} />
      <input type="text" placeholder="sku" {...sku} />
      <input type="text" placeholder="price" {...originalPrice} />
      <input type="text" placeholder="title" {...title} />
      <input type="text" placeholder="discount" {...discount} />
      <input type="checkbox" {...taxExempt} />
      <span> {discountedPrice}</span>
    </div>
  }
})

const Payment = React.createClass({
  render(){
    const { type, amount, checkNumber } = this.props
    return <div>
      <span>{type.value}</span>
      <input type="hidden" {...type} />
      <input type="text" {...amount} />
      {type.value === "check"
        ? <input type="text" {...checkNumber} />
        : null}
    </div>
  }
})

const AddSaleForm = React.createClass({
  propTypes: reduxFormPropTypes(fields),

  // TODO: we can memo-ize addPayment so we don't need this
  addCheck(){ return this.addPayment("check") },
  addCreditCard(){ return this.addPayment("credit_card") },
  addCash(){ return this.addPayment("cash") },

  addPayment(type){
    return this.props.fields.payments.addField({type, amount: "0.00"})
  },

  addLineItem(){
    return this.props.fields.lineItems.addField({})
  },

  componentDidUpdate(){
    console.log(this.props.values)
  },

  render(){
    const {
      fields: { salesTax, lineItems, payments, storeDiscount },
      // redux-form provided helpers
      error, handleSubmit, submitting, submitFailed,
      // other
      sale
    } = this.props

    return <form onSubmit={handleSubmit}>
      <div>
        <h2>Settings</h2>
        <input type="text" placeholder="salesTax" {...salesTax} />
        {salesTax.touched && salesTax.error && <span className="error">{salesTax.error}</span>}
      </div>

      <div>
        <h2>Items</h2>
        <a href="#" onClick={this.addLineItem}>Add Item</a>
      </div>
      <div>
        {lineItems.map((lineItem, i) => {
           return <LineItem key={i} fields={lineItem} calculated={sale.lineItems[i]} />
        })}
      </div>

      <div>
        <h2>Payments</h2>
        <a href="#" onClick={this.addCheck}>Check</a><br />
        <a href="#" onClick={this.addCreditCard}>Credit Card</a><br />
        <a href="#" onClick={this.addCash}>Cash</a><br />
      </div>
      <div>
        {payments.map((payment, i) => <Payment key={i} {...payment} />)}
      </div>

      <div>
        <h2>Totals</h2>
        <p>Subtotal -- {sale.discountedTotal}</p>
        <p>Taxes -- {sale.salesTaxAmount}</p>
        <p>Total -- {sale.salesTaxTotal}</p>
        <p>Payments -- {sale.paymentTotal}</p>
        <p>Change -- {sale.change}</p>
      </div>

      <p>
        {submitFailed && error && <span className="error">{error}</span>}
        <input type="submit" value="Submit" disabled={submitting} />
        {submitting && <img src="/img/loading.gif" />}
      </p>
    </form>
  }
})

function mapStateToProps(state, props){
  const sale = saleFromForm(props.values)
  return {sale}
}

export default reduxForm({
  form: 'addItem',
  fields
})(connect(mapStateToProps)(AddSaleForm))
