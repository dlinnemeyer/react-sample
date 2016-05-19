import React from 'react'
import {displayName} from '../models/consignor'
import {reduxForm} from 'redux-form'
import {reduxFormPropTypes} from '../misc'
import {assign} from 'lodash'
import {asyncify, channelPropType} from '../lib/asyncify/components'
import {getPriceMessage} from '../data/items'

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

const ItemForm = React.createClass({
  propTypes: assign(reduxFormPropTypes(fields), {
    priceChannel: channelPropType
  }),

  handleChange(evt){
    this.props.priceChannel.load(assign({}, this.props.values, {
      [evt.target.name]: evt.target.value
    }))
  },

  render(){
    const {
      fields: { sku, consignorid, title, brand, color, size, description, percSplit, price },
      // redux-form provided helpers
      error, handleSubmit, submitting, submitFailed,
      // the form's other props
      consignors, priceChannel
    } = this.props

    return <form onSubmit={handleSubmit} onBlur={this.handleChange}>
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
      </p>
      <p>
        <input type="text" placeholder="color" {...color} />
      </p>
      <p>
        <input type="text" placeholder="size" {...size} />
      </p>
      <p>
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
        {priceChannel.data && priceChannel.data.message && <span className="message">{priceChannel.data.message}</span>}
      </p>
      {submitFailed && error && <span className="error">{error}</span>}
      <p>
        <input type="submit" value="Submit" disabled={submitting} />
        {submitting && <img src="/img/loading.gif" />}
      </p>
    </form>
  }
})

const ItemFormAsync = asyncify(ItemForm, "itemform", {
  "priceChannel": {load: getPriceMessage}
})

export default reduxForm({
  form: 'addItem',
  fields,
  validate,
  initialValues
})(ItemFormAsync)
