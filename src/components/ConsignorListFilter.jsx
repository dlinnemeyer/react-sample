/**
 * The Filter will be a tiny form that just sends values back up to the parent form on submit.
 * We're doing on-submit instead of onchange here to reduce server calls? though onblur would
 * probably be better?
 */
import React, {PropTypes} from 'react'
import {reduxForm} from 'redux-form'

const fields = ["firstName", "lastName", "company", "isStoreAccount", "defaultPercSplit",
  "address", "address2", "city", "state", "zip", "email"]

const ConsignorListFilter = React.createClass({
  render(){
    const {
      fields: {
        firstName, lastName, company, isStoreAccount, defaultPercSplit, address, address2,
        city, state, zip, email
      },
      handleSubmit, submitting
    } = this.props

    return <form onSubmit={handleSubmit}>
      <p>
        <input type="text" placeholder="Email" {...email} />
        <input type="text" placeholder="First Name" {...firstName} />
        <input type="text" placeholder="Last Name" {...lastName} />
        <input type="text" placeholder="Company" {...company} />
      </p>
      <p>
        <label>Store Account</label>
        <select name="isStoreAccount" {...isStoreAccount} value={isStoreAccount.value || ''}>
          <option></option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
        <input type="text" placeholder="Split" {...defaultPercSplit} />
        <input type="text" placeholder="Address" {...address} />
        <input type="text" placeholder="Address 2" {...address2} />
      </p>
      <p>
        <input type="text" placeholder="City" {...city} />
        <input type="text" placeholder="State" {...state} />
        <input type="text" placeholder="Zip" {...zip} />
        <input type="submit" value="Search" disabled={submitting} />
        {submitting && <img src="/img/loading.gif" />}
      </p>
    </form>
  }
})

ConsignorListFilter.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'filterConsignorList',
  fields
})(ConsignorListFilter)
