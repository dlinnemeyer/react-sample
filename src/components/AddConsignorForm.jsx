import React from 'react';
import {findDOMNode} from 'react-dom';
import formSerialize from '../mixins/formSerialize';
import {reduxForm} from 'redux-form';

const fields = ["firstName", "lastName", "company", "isStoreAccount", "defaultPercSplit",
      "address", "address2", "city", "state", "zip"];

const AddConsignorForm = React.createClass({
  render(){
    const {
      fields: { firstName, lastName, company, isStoreAccount, defaultPercSplit, address, address2,
        city, state, zip },
      error, resetForm, handleSubmit, submitting
    } = this.props

    return <form onSubmit={this.submitHandler}>
      <p>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="text" placeholder="Company" />
      </p>
      <p>
        <label>
          <input type="checkbox" />
          Store Account
        </label>
        <input type="text" placeholder="Split" />
      </p>
      <p>
        <input type="text" placeholder="Address" />
        <input type="text" placeholder="Address 2" />
      </p>
      <p>
        <input type="text" placeholder="City" />
        <input type="text" placeholder="State" />
        <input type="text" placeholder="Zip" />
      </p>
      <p><input type="submit" value="Add Consignor" /></p>
      {this.props.isLoading && <img src="/img/loading.gif" />}
    </form>;
  }
});

AddConsignorForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'addConsignor',
  fields
})(AddConsignorForm);
