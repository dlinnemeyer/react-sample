import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/consignor';
import AddConsignorForm from './AddConsignorForm'
import {addConsignor} from '../actions/actions.js';
import {browserHistory} from 'react-router';

export const AddConsignor = React.createClass({
  mixins: [PureRenderMixin],
  onSubmit(data, dispatch){
    // should we just dispatch(addConsignor(data)) instead of doing the redux-action-binding thing?
    // seems more transparent?
    // return the promise for the form to handle. they'll need to be able to handle error display
    return this.props.addConsignor(data)
      .then((consignor) => {
        browserHistory.push('/consignors')
      })
      .catch((err) => {
        // the format we return here is for redux-form
        let formErr = {};
        switch(err.title){
          case 'duplicate_email':
            formErr = {email: "That email is already in use by another consignor."};
            break;
          default:
            formErr = {_error: "There was a problem entering that consignor into the system. Please try again."};
            break;
        }
        return Promise.reject(formErr);
      });
  },

  render(){
    return <div>
      <AddConsignorForm onSubmit={this.onSubmit} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
  }
}

export const AddConsignorContainer = connect(
  mapStateToProps, {addConsignor}
)(AddConsignor);
