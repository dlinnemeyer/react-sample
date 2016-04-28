import React from 'react';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList';
import ConsignorListFilter from './ConsignorListFilter';
import {Link} from 'react-router';
import {loadConsignors, deleteConsignor, deleteAllConsignors, addFakeConsignors, searchConsignors} from '../actions/consignors.js';
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

  onFilterSubmit(data, dispatch){
    // async data search that returns consignorids. searchConsignors populates the model repo for us
    // and sets our state.consignorSearch.ids
    // TODO: this will need to get more elaborate with pagination (totalResults, offset, etc.)
    // once other elements start searching consignors, this will likely need a namespace
    return this.props.searchConsignors(data);
  },

  render() {
    const {isLoading, consignors, addFakeConsignors, deleteAllConsignors} = this.props;
    const _addFakeConsignors = e => { e.preventDefault(); addFakeConsignors(); }
    const _deleteAllConsignors = e => { e.preventDefault(); deleteAllConsignors(); }
    return <div>
      <Link to="/consignors/new">Add Consignor</Link><br />
      <a href="#" onClick={_addFakeConsignors}>Add Lots O' Consignors</a><br />
      <a href="#" onClick={_deleteAllConsignors}>Delete All</a>
      {isLoading
        ? <InnerLoading />
        : (<div>
          <ConsignorListFilter onSubmit={this.onFilterSubmit} />
          <ConsignorList consignors={consignors} deleteConsignor={this.deleteConsignor} />
        </div>)}
    </div>;
  }
});

function mapStateToProps(state){
  // we'll need pagination at some point. for now, just grad consignorids resulting from the search?
  return {
    consignorids: state.consignorSearch.ids,
    // TODO: grab all the consignors from state.consignors that correspond to search ids
    consignors: state.consignors,
    isLoading: state.loading[loadingId]
  }
}

export const ConsignorsContainer = connect(mapStateToProps, {
  deleteConsignor, loading, loadConsignors, addFakeConsignors, deleteAllConsignors, searchConsignors
})(Consignors);
