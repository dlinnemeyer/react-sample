import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ItemDetails from './ItemDetails'
import {get as getConsignorFromState} from '../models/consignor';
import {get as getItemFromState} from '../models/item';
import {deleteItem} from '../actions/items.js';
import {loadConsignors} from '../actions/consignors'
import {loadItems} from '../actions/items'
import {loading} from '../actions/general'
import LoadingOverlay from './LoadingOverlay'
import {browserHistory} from 'react-router';
import InnerLoading from './InnerLoading'

export const Item = React.createClass({
  mixins: [PureRenderMixin],

  id(){
    return this.props.params.itemid;
  },

  loadingId(){
    return "item" + this.id();
  },

  deleteLoadingId(){
    return "item-delete" + this.id();
  },

  consignorLoadingId(){
    return "item-consignor" + this.id();
  },

  componentWillMount(){
    const loadingId = this.loadingId();
    // this feels stupid. sub-component that handles its own loading? not sure.
    const consignorLoadingId = this.consignorLoadingId();

    this.props.loading(loadingId, true);
    this.props.loading(consignorLoadingId, true);

    this.props.loadItems([this.id()])
      .then(items=> {
        const item = items[this.id()];
        this.props.loading(loadingId, false);
        // now make sure the consignor get loaded, too. this feels painful.
        return this.props.loadConsignors([item.consignorid]);
      })
      .then(consignors => {
        this.props.loading(consignorLoadingId, false);
      });
  },

  deleteItem(item){
    this.props.loading(this.deleteLoadingId(), true);
    this.props.deleteItem(item)
      .then(item => {
        this.props.loading(this.deleteLoadingId(), false);
        browserHistory.push('/items');
      });
  },

  render: function() {
    const { itemLoading, deleteLoading, consignorLoading, consignor, item } = this.props;

    // TODO: split consignor link off to a separate component? not sure we can do that.
    // is there a way to request both item and consignor at the same time?
    return <div>
      {itemLoading || consignorLoading
        ? <InnerLoading />
        : <ItemDetails item={item} consignor={consignor} deleteItem={this.deleteItem} />}
      {deleteLoading && <LoadingOverlay />}
    </div>;
  }
});

Item.propTypes = {
  itemLoading: PropTypes.bool.isRequired,
  consignorLoading: PropTypes.bool.isRequired,
  deleteLoading: PropTypes.bool.isRequired,
  consignor: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
}

function mapStateToProps(state, props){
  const id = props.params.itemid;
  const item = getItemFromState(state, id) || {};
  const consignor = getConsignorFromState(state, item.consignorid) || {};

  return {
    item: item,
    consignor: consignor,
    // we have to repeat the loadingid logic here, which is bad. we should have a better way of
    // doing this.
    itemLoading: !!(state.loading["item"+id]),
    deleteLoading: !!(state.loading["item-delete"+id]),
    consignorLoading: !!(state.loading["item-consignor"+id]),
  }
}

export const ItemContainer = connect(mapStateToProps, {
  deleteItem, loading, loadItems, loadConsignors
})(Item);
