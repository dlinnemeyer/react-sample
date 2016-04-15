import React from 'react';
import {findDOMNode} from 'react-dom';
import formSerialize from '../mixins/formSerialize';

export default React.createClass({

  mixins: [formSerialize],

  fields: ["firstName", "lastName", "company", "isStoreAccount", "defaultPercSplit",
      "address", "address2", "city", "state", "zip"],

  submitHandler(event){
    event.preventDefault();
    this.props.onSubmit(this.serialize());
  },

  render: function() {
    return <form onSubmit={this.submitHandler} ref="form">
      <p>
        <input type="text" defaultValue="" placeholder="First Name" name="firstName" ref="firstName" />
        <input type="text" defaultValue="" placeholder="Last Name" name="lastName" ref="lastName" />
        <input type="text" defaultValue="" placeholder="Company" name="company" ref="company" />
      </p>
      <p>
        <label>
          <input type="checkbox" name="isStoreAccount" ref="isStoreAccount" />
          Store Account
        </label>
        <input type="text" defaultValue="" placeholder="Split" name="defaultPercSplit" ref="defaultPercSplit" />
      </p>
      <p>
        <input type="text" defaultValue="" placeholder="Address" name="address" ref="address" />
        <input type="text" defaultValue="" placeholder="Address 2" name="address2" ref="address2" />
      </p>
      <p>
        <input type="text" defaultValue="" placeholder="City" name="city" ref="city" />
        <input type="text" defaultValue="" placeholder="State" name="state" ref="state" />
        <input type="text" defaultValue="" placeholder="Zip" name="zip" ref="zip" />
      </p>
      <p><input type="submit" value="Add Consignor" /></p>
      {this.props.isLoading && <img src="/img/loading.gif" />}
    </form>;
  }
});

