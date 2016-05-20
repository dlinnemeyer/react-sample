import React from 'react'
import {reduxForm} from 'redux-form'
import {reduxFormPropTypes} from '../misc'

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
  "payments[].checkNumber",
  "storeDiscount"
]

const LineItem = React.createClass({
  render(){
    const { id, sku, originalPrice, title, discount, taxExempt } = this.props
    return <div>
      <input type="hidden" {...id} />
      <input type="text" placeholder="sku" {...sku} />
      <input type="text" placeholder="price" {...originalPrice} />
      <input type="text" placeholder="title" {...title} />
      <input type="text" placeholder="discount" {...discount} />
      <input type="checkbox" {...taxExempt} />
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
      error, handleSubmit, submitting, submitFailed
    } = this.props

    return <form onSubmit={handleSubmit}>
      <div>
      </div>
      <div>
        <input type="text" placeholder="salesTax" {...salesTax} />
        {salesTax.touched && salesTax.error && <span className="error">{salesTax.error}</span>}
      </div>

      <div>
        <a href="#" onClick={this.addLineItem}>Add Item</a>
      </div>
      <div>
        {lineItems.map((lineItem, i) => <LineItem key={i} {...lineItem} />)}
      </div>

      <div>
        <a href="#" onClick={this.addCheck}>Check</a><br />
        <a href="#" onClick={this.addCreditCard}>Credit Card</a><br />
        <a href="#" onClick={this.addCash}>Cash</a><br />
      </div>
      <div>
        {payments.map((payment, i) => <Payment key={i} {...payment} />)}
      </div>

      <div>
        <input type="text" placeholder="storeDiscount" {...storeDiscount} />
        {storeDiscount.touched && storeDiscount.error && <span className="error">{storeDiscount.error}</span>}
      </div>

      <p>
        {submitFailed && error && <span className="error">{error}</span>}
        <input type="submit" value="Submit" disabled={submitting} />
        {submitting && <img src="/img/loading.gif" />}
      </p>
    </form>
  }
})

export default reduxForm({
  form: 'addItem',
  fields
})(AddSaleForm)

