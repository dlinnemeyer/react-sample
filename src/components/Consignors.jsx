import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList';
import {Link} from 'react-router';
import {deleteConsignor, deleteConsignorLoading} from '../actions/actions.js';
import LoadingOverlay from './LoadingOverlay'

export const Consignors = React.createClass({
  deleteConsignor(consignor){
    // wrap the action with some global loading? form loading is handled in redux-form, but not
    // anchors/buttons. I wonder if we can find a way to wrap a button/link with loading state
    // similar to how redux-form wraps forms?
    // alternately, we could write a helper functional wrapper that just assumes a promise-based
    // action and toggles a certain loading key in the state before and after?
    // something like this?
    //   wrapLoading(this.props.deleteConsignor(consignor), 'deleteConsignor', consignor.id)
    // That would store true/false in loading.deleteConsignor[id] in the state.
    // It could also return a promise that passes along the values from deleteConsignor, so you
    // could still chain on it
    this.props.deleteConsignorLoading(true);
    this.props.deleteConsignor(consignor)
      .then(consignor => this.props.deleteConsignorLoading(false));
  },

  render() {
    return <div>
      <Link to="/consignors/new">Add Consignor</Link>
      <ConsignorList consignors={this.props.consignors} deleteConsignor={this.deleteConsignor} />
      {this.props.deleteIsLoading && <LoadingOverlay />}
    </div>;
  }
});

function mapStateToProps(state){
  return {
    consignors: state.consignors,
    deleteIsLoading: state.loading.deleteConsignor
  }
}

export const ConsignorsContainer = connect(mapStateToProps, {
  deleteConsignor, deleteConsignorLoading
})(Consignors);
