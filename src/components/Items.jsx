import React from 'react';
import {connect, withRouter} from 'react-redux';
import ItemList from './ItemList';
import ConsignorListFilter from './ConsignorListFilter';
import {searchItems, addFakeItems, deleteAllItems} from '../actions/items.js';
import {loading} from '../actions/general.js';
import {Link} from 'react-router';
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {isEqual} from 'lodash/fp'
import {asyncify} from '../lib/asyncify'

export const Items = React.createClass({

  setUserSettings(data){
    const query = Object.assign({}, this.props.userSettings, data);
    history.push({pathname: '/consignors', query});
    this.loadConsignors(query);
  },

  lastSettingsLoad: undefined,
  loadItems(settings, force = false){
    if(!settings) settings = this.props.userSettings || {};
    if(!force && isEqual(this.lastSettingsLoad, settings)) return Promise.resolve();

    this.lastSettingsLoad = settings;

    const { filters, sortBy, page } = settings;
    return this.props.items.load(filters, sortBy, {perPage: 30, page});
  },

  componentWillMount(){
    this.loadItems();
  },

  componentWillReceiveProps(){
    this.loadItems();
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
    const {items, addFakeItems, deleteAllItems, userSettings} = this.props;
    const _addFakeItems = e => { e.preventDefault(); addFakeItems(); }
    const _deleteAllItems = e => { e.preventDefault(); deleteAllItems(); }
    return <div>
      <Link to="/items/new">Add Item</Link><br />
      <Link to={{pathname: "/items", query: {"printed": "0"}}}>Unprinted Items</Link><br />
      <a href="#" onClick={_addFakeItems}>Add Lots O' Items</a><br />
      <a href="#" onClick={_deleteAllItems}>Delete All</a>
      {items.loading
        ? <InnerLoading />
        : <ItemList items={items.data} />}
    </div>;
  }

});

function mapStateToProps(state, props){
  const userSettings = Object.assign({
    page: "1",
    sortBy: "sku",
    filters: {}
  }, props.location.query);

  const consignors = props.search.data.ids.map(id => state.consignors[id]);

  return {
    consignors,
    userSettings
  };
}

const ReduxedItems = connect(mapStateToProps)(withRouter(Items));

export const ItemsContainer = asyncify(ReduxedConsignors, "itemslist", {
  "items": { data: {}, loading: true, load: searchItems }
});
