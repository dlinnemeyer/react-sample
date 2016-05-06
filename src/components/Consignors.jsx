import React from 'react';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList';
import ConsignorListFilter from './ConsignorListFilter';
import {Link} from 'react-router';
import {
  loadConsignors, deleteConsignor, deleteAllConsignors, addFakeConsignors, searchConsignors
} from '../actions/consignors.js';
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {browserHistory} from 'react-router'
import * as qs from 'qs'
import {isEqual} from 'lodash/fp'
import {asyncify} from '../lib/asyncify.js'

export const Consignors = React.createClass({

  setUserSettings(data){
    const queryParams = Object.assign({}, this.props.userSettings, data);
    let queryString = qs.stringify(queryParams);
    if(queryString.length) queryString = "?"+queryString;

    browserHistory.push('/consignors'+queryString);
    this.loadConsignors(queryParams);
  },

  componentWillMount(){
    this.loadConsignors();
  },

  componentWillReceiveProps(){
    this.loadConsignors();
  },

  lastSettingsLoad: undefined,

  loadConsignors(settings){
    if(!settings) settings = this.props.userSettings || {};
    if(isEqual(this.lastSettingsLoad, settings)) return Promise.resolve();

    this.lastSettingsLoad = settings;
    const { filters, sortBy, page } = settings;

    return this.props.search.load(filters, sortBy, {perPage: 30, page});
  },

  onFilterSubmit(data){
    this.setUserSettings({filters: data});
  },

  paginate(page){
    this.setUserSettings({page});
  },

  sort(sortBy){
    this.setUserSettings({sortBy});
  },

  render() {
    const {
      search, consignors, addFakeConsignors, deleteAllConsignors,
      userSettings
    } = this.props;

    const _addFakeConsignors = e => { e.preventDefault(); addFakeConsignors(); }
    const _deleteAllConsignors = e => { e.preventDefault(); deleteAllConsignors(); }
    return <div>
      <Link to="/consignors/new">Add Consignor</Link><br />
      <Link to={{pathname: "/consignors", query: {"filters[isStoreAccount]": "1"}}}>Store Accounts</Link><br />
      <a href="#" onClick={_addFakeConsignors}>Add Lots O' Consignors</a><br />
      <a href="#" onClick={_deleteAllConsignors}>Delete All</a>
      <ConsignorListFilter initialValues={userSettings.filters} onSubmit={this.onFilterSubmit} refs='filterConsignorsForm' />
      {search.loading
        ? <InnerLoading />
        : (<div>
            <Pagination total={search.data.count} pages={search.data.pages} page={parseInt(userSettings.page)} onPage={this.paginate} />
            <ConsignorList consignors={consignors} deleteConsignor={this.deleteConsignor}
              sort={this.sort} />
          </div>)}
    </div>;
  }
});


function mapStateToProps(state, props){
  const queryParams = props.location.search.length
    ? qs.parse(props.location.search.slice(1))
    : {};
  const userSettings = Object.assign({
    page: "1",
    sortBy: "displayName",
    filters: {}
  }, queryParams);

  const consignors = {};
  (props.search.data.ids || []).forEach(id => {
    consignors[id] = state.consignors[id];
  });

  return {
    consignors,
    userSettings
  };
}

const ReduxedConsignors = connect(mapStateToProps, {
  addFakeConsignors, deleteAllConsignors
})(Consignors);

export const ConsignorsContainer = asyncify(ReduxedConsignors, "consignorslist", {
  "search": { data: {ids: []}, loading: true, load: searchConsignors }
});
