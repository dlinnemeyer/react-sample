import React from 'react';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList';
import ConsignorListFilter from './ConsignorListFilter';
import {Link} from 'react-router';
import {loadConsignors, deleteConsignor, deleteAllConsignors, addFakeConsignors, searchConsignors} from '../actions/consignors.js';
import {loading, updatePageData} from '../actions/general.js';
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'

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
    // TODO: this will need to get more elaborate with pagination (totalResults, offset, etc.)
    // once other elements start searching consignors, this will likely need a namespace
    return this.loadConsignors(data);
  },

  loadConsignors(data, sortBy, page){
    if(!data) data = this.props.filterConsignorList || {};
    if(!sortBy) sortBy = this.props.pageData.sortBy;
    if(!page) page = this.props.pageData.page;

    // TODO: this should be a parameter, too
    const perPage = 20;

    this.props.loading(loadingId, true);
    return this.props.searchConsignors(data, sortBy)
      .then(consignors => {
        const ids = Object.keys(consignors);
        const start = (page - 1) * perPage;
        const end = start + perPage;
        this.props.updatePageData(loadingId, {
          ids: ids.slice(start, end),
          pages: Math.ceil(ids.length / perPage),
          count: ids.length
        });
        this.props.loading(loadingId, false);
      });
  },

  paginate(page){
    this.props.updatePageData(loadingId, {page});
    this.loadConsignors(undefined, undefined, page);
  },

  sort(sortBy){
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

function mapStateToProps(state){
  // we'll need pagination at some point. for now, just grad consignorids resulting from the search?
  const pageData = Object.assign({
    ids: [],
    sortBy: "displayName",
    page: 1
  }, state.pages[loadingId] || {});

  const consignors = {};
  pageData.ids.forEach(function(id){
    consignors[id] = state.consignors[id];
  });

  return {
    consignors: consignors,
    pageData: pageData,
    isLoading: state.loading[loadingId],
    // hijack the form data. HACK: we should probably actually connect this container to reduxform?
    // and just have the listfilter thingy handle displaying the fields and things?
    // that way we have access to the data? or we could just store the data changes in the query
    // string, and always pull from the query string when loading consignors?
    filterConsignorList: state.form.filterConsignorList
  };
}

export const ConsignorsContainer = connect(mapStateToProps, {
  deleteConsignor, loading, addFakeConsignors, deleteAllConsignors, searchConsignors, updatePageData
})(Consignors);
