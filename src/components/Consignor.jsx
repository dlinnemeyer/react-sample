import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {get as getConsignorFromState} from '../models/consignor';
import {getAll as getItemsFromState} from '../models/item';
import ConsignorDetails from './ConsignorDetails'
import ItemList from './ItemList'
import {loadConsignor} from '../actions/consignors'
import {loadItems} from '../actions/items'
import InnerLoading from './InnerLoading'
import Error from './Error'
import {asyncify} from '../lib/asyncify'
import {map} from 'lodash'

export const Consignor = React.createClass({

  id(){
    return this.props.params.consignorid;
  },

  componentWillMount(){
    this.props.consignor.load(this.id())
      .then(consignor => this.props.items.load(consignor.items));
  },

  itemsData(){
    return map(this.props.items.data, i => i);
  },

  render: function() {
    const { consignor, items } = this.props;

    return <div>
      {consignor.loading
        ? <InnerLoading />
        : <ConsignorDetails consignor={consignor.data} />}
      {items.loading || consignor.loading
        ? <InnerLoading />
        : <ItemList items={this.itemsData()} />}
    </div>;
  }
});

Consignor.propTypes = {
  consignor: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired
}

const ReduxedConsignor = connect()(Consignor);

export const ConsignorContainer = asyncify(ReduxedConsignor, "consignor", {
  "consignor": {data: {}, loading: true, load: loadConsignor },
  "items": {data: {}, load: loadItems}
});
