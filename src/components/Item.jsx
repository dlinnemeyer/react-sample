import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ItemDetails from './ItemDetails'

export const Item = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div>
      <ItemDetails item={this.props.item} consignor={this.props.consignor} />
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
  let item = state.get('items').get(props.params.itemid);
  console.log(item.get("consignorid"), state.get('consignors').get(item.get("consignorid")));
  console.log(state.get('consignors').get(item.get("consignorid") + ""));
  return {
    item: item,
    consignor: state.get('consignors').get(item.get("consignorid"))
  }
}

export const ItemContainer = connect(mapStateToProps)(Item);

