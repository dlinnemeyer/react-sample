import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/item';
import AddItemForm from './AddItemForm';
import {loading, addItem} from '../actions/actions.js';
import {browserHistory} from 'react-router';

export const AddItem = React.createClass({
  mixins: [PureRenderMixin],
  onSubmit(data, dispatch){
    // should we just dispatch(addItem(data)) instead of doing the redux-action-binding thing?
    // seems more transparent?
    // return the promise for the form to handle. they'll need to be able to handle error display
    return this.props.addItem(data)
      .then((item) => {
        browserHistory.push('/items')
      })
      .catch((err) => {
        // the format we return here is for redux-form
        let formErr = {};
        switch(err.title){
          case 'duplicate_sku':
            formErr = {sku: "That sku is already being used."};
            break;
          default:
            formErr = {_error: "There was a problem entering that item into the system. Please try again."};
            break;
        }
        return Promise.reject(formErr);
      });
  },

  render: function() {
    return <AddItemForm onSubmit={this.onSubmit} consignors={this.props.consignors} />;
  }
});

function mapStateToProps(state, props){
  return {
    // we'll need to request all the consignors for this? or probably ideally an autocomplete?
    consignors: state.consignors
  }
}

export const AddItemContainer = connect(
  mapStateToProps, {
    addItem
  }
)(AddItem);
