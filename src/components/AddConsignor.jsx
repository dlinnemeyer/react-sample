import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/consignor';
import AddConsignorForm from './AddConsignorForm'
import {addConsignor} from '../actions/actions.js';
import {browserHistory} from 'react-router';

export const AddConsignor = React.createClass({
  mixins: [PureRenderMixin],
  onSubmit(data){
    // when we async-ify this, we'll want to navigate after the action propogates
    this.props.addConsignor(data).then((consignor) => browserHistory.push('/consignors'));
  },

  isLoading(){
    return !!this.props.formLoading;
  },

  render(){
    return <div>
      <AddConsignorForm onSubmit={this.onSubmit} isLoading={this.isLoading()} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
    formLoading: state.loading.addConsignor
  }
}

export const AddConsignorContainer = connect(
  mapStateToProps, {addConsignor}
)(AddConsignor);
