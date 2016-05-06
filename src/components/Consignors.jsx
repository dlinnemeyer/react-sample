import React from 'react';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList';
import ConsignorListFilter from './ConsignorListFilter';
import {Link} from 'react-router';
import {loadConsignors, deleteConsignor, deleteAllConsignors, addFakeConsignors, searchConsignors} from '../actions/consignors.js';
import {loading, updateComponentData} from '../actions/general.js';
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {browserHistory} from 'react-router'
import * as qs from 'qs'
import {isEqual} from 'lodash/fp'

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
    this.props.loading(this.props.componentId, true);
    this.props.deleteConsignor(consignor)
      .then(consignor => this.props.loading(this.props.componentId, false));
  },

  // TODO: maybe replace this sort of thing with an "action" in general that pushes a query
  // string to the current url?
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
    console.log(this.props.search);
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

function asyncify(Component, componentId, channels = {}){
  const wrapper = React.createClass({
    render(){
      return <Component {...this.props} />;
    }
  });

  function asyncWrap(func, componentId, channelId){
    return (...args) => {
      const async = func(...args);

      return dispatch => {
        dispatch(loading(componentId, subComponentId, true));
        return async(dispatch)
          .then((data) => {
            console.log(data);
            dispatch(updateComponentData(componentId, subComponentId, data));
            return data;
          })
          .then(() => dispatch(loading(componentId, subComponentId, false)))
          .catch(globalErrorize(dispatch));
          // catch other errors and dispatch loading action?
      }
    }
  }

  function mapStateToProps(state, _props){
    const component = state.components[componentId] || {};

    const props = {componentId};
    // TODO: each channel should have a root-level prop for loading, data, error, etc.
    Object.keys(channels).forEach(ch => {
      const channel = channels[ch];
      props[ch] = Object.assign(channel.defaults, component[ch]);

      // wrap async function for them
      if(channel.load) props[ch].load = (...args) => _props.dispatch(asyncWrap(channel.load, componentId, ch)(...args));
    });

    // TODO: add some global things, like isAnyLoading, isAnyErrors, etc.?

    return props;
  }

  return connect(mapStateToProps)(wrapper);
}

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
  deleteConsignor, loading, addFakeConsignors, deleteAllConsignors
})(Consignors);

export const ConsignorsContainer = asyncify(ReduxedConsignors, "consignorslist", {
  "search": {defaults: {data: {ids: []}, loading: true}, load: searchConsignors}
});
