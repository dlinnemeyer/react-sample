import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ItemDetails from './ItemDetails'
import {deleteItem, deleteItemLoading} from '../actions/actions.js';
import LoadingOverlay from './LoadingOverlay'
import {browserHistory} from 'react-router';

export const Item = React.createClass({
  mixins: [PureRenderMixin],

  deleteItem(item){
    this.props.deleteItemLoading(true);
    this.props.deleteItem(item)
      .then(item => {
        this.props.deleteItemLoading(false);
        browserHistory.push('/items');
      });
  },

  validItem(){
    return !!(this.props.item);
  },

  render: function() {
    return <div>
      {this.validItem()
        ? <ItemDetails item={this.props.item} consignor={this.props.consignor}
          deleteItem={this.deleteItem} />
        : <div>Invalid itemid</div>}
      {this.props.deleteIsLoading && <LoadingOverlay />}
    </div>;
  }
});

function mapStateToProps(state, props){
  // the way we're doing this seems wrong. ember's built-in relationships between models is nice.
  // but if we treat these wrapper components like controller components and have them define our
  // data needs with some sort of data request, it doesn't feel quite as bad. We know the
  // ItemDetails component needs the fully-hydrated consignor, so we grab it. if it doesn't, we
  // can avoid the data call for it.
  // the fine-grained control seems like over-kill, but it's easier to follow? and probably
  // not as much of a pain if we go with a more formalized data-fetching layer with more
  // structured models? somewhere between this and ember?
  let item = state.items[props.params.itemid]
  return {
    item: item,
    consignor: item ? state.consignors[item.consignorid] : undefined,
    deleteIsLoading: state.loading.deleteItem
  }
}

export const ItemContainer = connect(mapStateToProps, {
  deleteItem, deleteItemLoading
})(Item);
