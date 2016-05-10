import React, {PropTypes} from 'react'
import {displayName} from '../models/consignor'
import {reduxForm} from 'redux-form'

const fields = ["sku", "consignorid", "title", "brand", "color", "size", "description",
  "percSplit", "price"]
const initialValues = {
  percSplit: 50
}

const validate = values => {
  const errors = {}
  if(!values.sku){
    errors.sku = "Required"
  }
  if(!values.title){
    errors.title = "Required"
  }

  if(!values.percSplit){
    errors.percSplit = "Required"
  }
  const percSplit = parseFloat(values.percSplit)
  if(isNaN(percSplit) || percSplit < 0){
    errors.percSplit = "That's not a valid percent split."
  }

  if(!values.price){
    errors.price = "Required"
  }
  const price = parseFloat(values.price)
  if(isNaN(price) || price < 0){
    errors.price = "That's not a valid price."
  }

  return errors
}

const AddItemForm = React.createClass({
  render() {
    const {
      fields: { sku, consignorid, title, brand, color, size, description, percSplit, price },
      // redux-form provided helpers
      error, handleSubmit, submitting, submitFailed,
      // the form's other props
      consignors
    } = this.props

    return <form onSubmit={handleSubmit}>
      <p>
        <input type="text" placeholder="sku" {...sku} />
        {sku.touched && sku.error && <span className="error">{sku.error}</span>}
      </p>
      <p>
        <label>Consignor</label>
        <select {...consignorid}>
          {Object.keys(consignors).map(c => {
            const consignor = consignors[c]
            return (
              <option key={consignor.id} value={consignor.id}>{displayName(consignor)}</option>
            )
          })}
        </select>
      </p>
      <p>
        <input type="text" placeholder="title" {...title} />
        {title.touched && title.error && <span className="error">{title.error}</span>}
      </p>
      <p>
        <input type="text" placeholder="brand" {...brand} />
        <input type="text" placeholder="color" {...color} />
      </p>
      <p>
        <input type="text" placeholder="size" {...size} />
        <input type="text" placeholder="description" {...description} />
      </p>
      <p>
        <label>Consignor Split</label>
        <input type="text" placeholder="percSplit" {...percSplit} />
        {percSplit.touched && percSplit.error && <span className="error">{percSplit.error}</span>}
      </p>
      <p>
        <label>Price</label>
        $<input type="text" placeholder="price" {...price} />
        {price.touched && price.error && <span className="error">{price.error}</span>}
      </p>
      {submitFailed && error && <span className="error">{error}</span>}
      <p>
        <input type="submit" value="Add Item" disabled={submitting} />
        {submitting && <img src="/img/loading.gif" />}
      </p>
    </form>
  }
})

AddItemForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'addItem',
  fields,
  validate,
  initialValues
})(AddItemForm)
