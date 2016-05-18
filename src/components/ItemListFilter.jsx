/**
 * The Filter will be a tiny form that just sends values back up to the parent form on submit.
 * We're doing on-submit instead of onchange here to reduce server calls? though onblur would
 * probably be better?
 */
import React from 'react'
import {reduxForm} from 'redux-form'
import {reduxFormPropTypes} from '../misc'

const fields = ["sku", "title", "brand", "color", "size", "description",
  "percSplit", "price", "printed"]

function ItemListFilter(props){
  const {
    fields: {
      sku, title, brand, color, size, description, price, printed
    },
    handleSubmit, submitting
  } = props

  return <form onSubmit={handleSubmit}>
    <p>
      <input type="text" placeholder="sku" {...sku} />
      <input type="text" placeholder="title" {...title} />
      <input type="text" placeholder="brand" {...brand} />
      <input type="text" placeholder="color" {...color} />
    </p>
    <p>
      <label>Printed</label>
      <select name="printed" {...printed} value={printed.value || ''}>
        <option></option>
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>
      <input type="text" placeholder="size" {...size} />
      <input type="text" placeholder="description" {...description} />
      <input type="text" placeholder="price" {...price} />
      <input type="submit" value="Search" disabled={submitting} />
      {submitting && <img src="/img/loading.gif" />}
    </p>
  </form>
}
ItemListFilter.propTypes = reduxFormPropTypes

export default reduxForm({
  form: 'filterItemList',
  fields
})(ItemListFilter)

