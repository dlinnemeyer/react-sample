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
  "storeDiscount",
  "consignorid"
]

const AddSaleForm = React.createClass({
  propTypes: reduxFormPropTypes(fields),

  render(){
    const {
      fields: { salesTax },
      // redux-form provided helpers
      error, handleSubmit, submitting, submitFailed
    } = this.props

    return <form onSubmit={handleSubmit}>
      <p>
        <input type="text" placeholder="salesTax" {...salesTax} />
        {salesTax.touched && salesTax.error && <span className="error">{salesTax.error}</span>}
      </p>
      {submitFailed && error && <span className="error">{error}</span>}
      <p>
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

