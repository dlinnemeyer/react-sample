import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/item';
import AddItemForm from './AddItemForm';
import {loading, addItem} from '../actions/actions.js';
import {browserHistory} from 'react-router';

export const AddItem = React.createClass({
  mixins: [PureRenderMixin],
  onSubmit(data){
    this.props.addItem(data).then((item) => browserHistory.push('/items'));
  },

  isLoading(){
    return !!this.props.formLoading;
  },

  render: function() {
    return <div>
      <AddItemForm onSubmit={this.onSubmit} consignors={this.props.consignors}
        isLoading={this.isLoading()} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
    // we'll need to request all the consignors for this? or probably ideally an autocomplete?
    consignors: state.consignors,
    formLoading: state.loading.addItem
  }
}

export const AddItemContainer = connect(
  mapStateToProps, {
    addItem,
    loading
  }
)(AddItem);
