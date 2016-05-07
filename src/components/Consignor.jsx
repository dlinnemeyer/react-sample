import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {get as getConsignorFromState} from '../models/consignor';
import {getAll as getItemsFromState} from '../models/item';
import ConsignorDetails from './ConsignorDetails'
import ItemList from './ItemList'
import {loadConsignors} from '../actions/consignors'
import {loadItems} from '../actions/items'
import InnerLoading from './InnerLoading'
import Error from './Error'
import {asyncify} from '../lib/asyncify'

export const Consignor = React.createClass({

  id(){
    return this.props.params.consignorid;
  },

  componentWillMount(){
    this.props.consignor.load([this.id()]);
  },

  render: function() {
    const { consignorData, itemsData } = this.props;
    const consignor = consignorData;
    const items = itemsData;
    const itemsLoading = this.props.items.loading;

    return <div>
      <ConsignorDetails consignor={consignor} />
      {itemsLoading
        ? <InnerLoading />
        : <ItemList items={items} />}
    </div>;
  }
});

Consignor.propTypes = {
  consignorData: PropTypes.object.isRequired,
  itemsData: PropTypes.array.isRequired
}

function mapStateToProps(state, props){
  const consignorData = getConsignorFromState(state, props.consignor.data.consignorid) || {};
  // this items part will have to go through some re-working if we make it filterable. probably
  // an itemlist component that takes filters instead of itemids and retrieves its own itemids?
  const itemsData = getItemsFromState(state, props.items.data.ids) || [];

  return {
    consignorData,
    itemsData
  }
}

const ReduxedConsignor = connect(mapStateToProps)(Consignor);

export const ConsignorContainer = asyncify(ReduxedConsignor, "consignor", {
  "consignor": {data: {}, loading: true, load: loadConsignors},
  "items": {data: {ids: []}, load: loadItems}
});
