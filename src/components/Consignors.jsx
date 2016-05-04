import React from 'react';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList';
import ConsignorListFilter from './ConsignorListFilter';
import {Link} from 'react-router';
import {loadConsignors, deleteConsignor, deleteAllConsignors, addFakeConsignors, searchConsignors} from '../actions/consignors.js';
import {loading, updatePageData} from '../actions/general.js';
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {browserHistory} from 'react-router'
import * as qs from 'qs'

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
    this.loadConsignors();
  },

  onFilterSubmit(data, dispatch){
    // TODO: push the data up to query string. define this.setUserSettings, which calls this.loadConsignors()?
    return this.loadConsignors(data);
  },

  loadConsignors(data, sortBy, page){
    // TODO: default data should be this.props.userSettings? page should also be in usersettings? same with sortby?
    if(!data) data = this.props.filterConsignorList || {};
    if(!sortBy) sortBy = this.props.pageData.sortBy;
    if(!page) page = this.props.pageData.page;

    // TODO: this should be a parameter, too
    const perPage = 30;

    this.props.loading(loadingId, true);
    return this.props.searchConsignors(data, sortBy)
      .then(consignors => {
        const ids = Object.keys(consignors);
        const start = (page - 1) * perPage;
        const end = start + perPage;
        // TODO: change this? updating derived/async page data
        this.props.updatePageData(loadingId, {
          ids: ids.slice(start, end),
          pages: Math.ceil(ids.length / perPage),
          count: ids.length
        });
        this.props.loading(loadingId, false);
      });
  },

  paginate(page){
    // TODO: call this.setUserSettings
    this.props.updatePageData(loadingId, {page});
    this.loadConsignors(undefined, undefined, page);
  },

  sort(sortBy){
    // TODO: call this.setUserSettings
    this.props.updatePageData(loadingId, {sortBy});
    this.loadConsignors(undefined, sortBy);
  },

  render() {
    const {
      isLoading, consignors, addFakeConsignors, deleteAllConsignors,
      pageData
    } = this.props;

    const _addFakeConsignors = e => { e.preventDefault(); addFakeConsignors(); }
    const _deleteAllConsignors = e => { e.preventDefault(); deleteAllConsignors(); }
    return <div>
      <Link to="/consignors/new">Add Consignor</Link><br />
      <a href="#" onClick={_addFakeConsignors}>Add Lots O' Consignors</a><br />
      <a href="#" onClick={_deleteAllConsignors}>Delete All</a>
      <ConsignorListFilter onSubmit={this.onFilterSubmit} refs='filterConsignorsForm' />
      {isLoading
        ? <InnerLoading />
        : (<div>
            <Pagination total={pageData.count} pages={pageData.pages} page={pageData.page} onPage={this.paginate} />
            <ConsignorList consignors={consignors} deleteConsignor={this.deleteConsignor}
              sort={this.sort} />
          </div>)}
    </div>;
  }
});

function mapStateToProps(state, props){
  // pageData is for internal async data and derived data? query string for user-chosen options?
  // I'd imagine this will be a common pattern?
  const pageData = Object.assign({
    ids: []
  }, state.pages[loadingId] || {});
  const userSettings = Object.assign({
    page: 1
  }, props.location.query || {});

  const consignors = {};
  pageData.ids.forEach(function(id){
    consignors[id] = state.consignors[id];
  });

  return {
    consignors,
    pageData,
    userSettings,
    // Maybe a HACK? on initial load, loading isn't yet set to true, but we haven't retrieved data.
    // so just set to true in the absence of a loading value in state
    isLoading: loadingId in state.loading ? state.loading[loadingId] : true
  };
}

export const ConsignorsContainer = connect(mapStateToProps, {
  deleteConsignor, loading, addFakeConsignors, deleteAllConsignors, searchConsignors, updatePageData
})(Consignors);
