import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/consignor';
import ConsignorDetails from './ConsignorDetails'
import ItemList from './ItemList'

export const Consignor = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div>
      <ConsignorDetails consignor={this.props.consignor} />
      <ItemList items={this.props.items} />
    </div>;
  }
});

function mapStateToProps(state, props){
  let consignor = state.get('consignors').get("2");
  return {
    consignor: consignor,
    items: consignor.get("items").map(id => state.get("items").get(id))
  }
}

export const ConsignorContainer = connect(mapStateToProps)(Consignor);
