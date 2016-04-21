import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList';
import {Link} from 'react-router';
import {loadConsignors, deleteConsignor} from '../actions/consignors.js';
import {loading} from '../actions/general.js';
import InnerLoading from './InnerLoading'

const loadingId = "consignorslist";

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
    this.props.loading(loadingId, true);
    this.props.deleteConsignor(consignor)
      .then(consignor => this.props.loading(loadingId, false));
  },

  componentWillMount(){
    this.props.loading(loadingId, true);
    this.props.loadConsignors()
      .then(consignors => {
        this.props.loading(loadingId, false);
      });
  },

  render() {
    const {isLoading, consignors} = this.props;
    return <div>
      <Link to="/consignors/new">Add Consignor</Link>
      {isLoading
        ? <InnerLoading />
        : <ConsignorList consignors={consignors} deleteConsignor={this.deleteConsignor} />}
    </div>;
  }
});

function mapStateToProps(state){
  return {
    // TODO: we need to figure out a better state structure for this page, since right now it just
    // hooks into the data consignors hash, which is more a model repository.
    // Maybe a pages object, keyed to pagename, that stores page-specific state? we could
    // store an array of currently displayed consignorsids there, with pagination info and filters?
    consignors: state.consignors,
    isLoading: state.loading[loadingId]
  }
}

export const ConsignorsContainer = connect(mapStateToProps, {
  deleteConsignor, loading, loadConsignors
})(Consignors);
