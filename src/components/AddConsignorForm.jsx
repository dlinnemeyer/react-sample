import React, {PropTypes} from 'react'
import {reduxForm} from 'redux-form'

const fields = ["firstName", "lastName", "company", "isStoreAccount", "defaultPercSplit",
  "address", "address2", "city", "state", "zip", "email"]

// at some point we should have some general validators module that we can use to build
// a validate function. probably pass in a big hash keyed to field with things like required,
// data type (inter/float), max/min length, etc. should be pretty easy to unit test, too
const validate = values => {
  const errors = {}
  if(!values.email){
    errors.email = "Required"
  }
  if(!values.defaultPercSplit){
    errors.defaultPercSplit = "Required"
  }
  if(!(values.firstName && values.lastName) && !values.company){
    errors['_error'] = "Need a name or company"
  }
  return errors
}

const AddConsignorForm = React.createClass({
  render(){
    const {
      fields: { firstName, lastName, company, isStoreAccount, defaultPercSplit, address, address2,
        city, state, zip, email },
      // redux-form provided helpers
      error, handleSubmit, submitting, submitFailed
    } = this.props

    return <form onSubmit={handleSubmit}>
      <p>
        <input type="text" placeholder="Email" {...email} />
        {email.touched && email.error && <span className="error">{email.error}</span>}
      </p>
      <p>
        <input type="text" placeholder="First Name" {...firstName} />
        <input type="text" placeholder="Last Name" {...lastName} />
        <input type="text" placeholder="Company" {...company} />
      </p>
      <p>
        <label>
          <input type="checkbox" {...isStoreAccount} />
          Store Account
        </label>
        <input type="text" placeholder="Split" {...defaultPercSplit} />
        {defaultPercSplit.touched && defaultPercSplit.error && <span className="error">{defaultPercSplit.error}</span>}
      </p>
      <p>
        <input type="text" placeholder="Address" {...address} />
        <input type="text" placeholder="Address 2" {...address2} />
      </p>
      <p>
        <input type="text" placeholder="City" {...city} />
        <input type="text" placeholder="State" {...state} />
        <input type="text" placeholder="Zip" {...zip} />
      </p>
      {submitFailed && error && <span className="error">{error}</span>}
      <p>
        <input type="submit" value="Add Consignor" disabled={submitting} />
        {submitting && <img src="/img/loading.gif" />}
      </p>
    </form>
  }
})

AddConsignorForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'addConsignor',
  fields,
  validate
})(AddConsignorForm)
