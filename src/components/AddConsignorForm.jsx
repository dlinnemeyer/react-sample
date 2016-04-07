import React from 'react';
import {findDOMNode} from 'react-dom';

export default React.createClass({

  serialize(){
    let dataRefs = ["firstName", "lastName"];
    let data = {};
    dataRefs.forEach(ref => data[ref] = this.refs[ref].value);

    return data;
  },

  submitHandler(event){
    event.preventDefault();
    this.props.onSubmit(this.serialize());
  },

  render: function() {
    return <form onSubmit={this.submitHandler} ref="form">
      <p><input type="text" defaultValue="" placeholder="First Name" name="firstName" ref="firstName" /></p>
      <p><input type="text" defaultValue="" placeholder="Last Name" name="lastName" ref="lastName" /></p>
      <p><input type="submit" value="Add Consignor" /></p>
    </form>;
  }
});

