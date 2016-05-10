import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import ConsignorDetails from './ConsignorDetails'
import ItemList from './ItemList'
import {loadConsignor} from '../actions/consignors'
import {searchItems} from '../actions/items'
import InnerLoading from './InnerLoading'
import {asyncify} from '../lib/asyncify'

export const Consignor = React.createClass({

  id(){
    return this.props.params.consignorid
  },

  componentWillMount(){
    this.props.consignor.load(this.id())
    // TODO: we should probably paginate this. we have a pagination component that'd be easy to inject
    this.props.items.load({consignorid: this.id()}, "sku", {page: 1, perPage: 50})
  },

  render: function() {
    const { consignor, items } = this.props

    return <div>
      {consignor.loading
        ? <InnerLoading />
        : <ConsignorDetails consignor={consignor.data} />}
      {items.loading || consignor.loading
        ? <InnerLoading />
        : <ItemList items={items.data.items} />}
    </div>
  }
})

Consignor.propTypes = {
  consignor: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired
}

const ReduxedConsignor = connect()(Consignor)

export const ConsignorContainer = asyncify(ReduxedConsignor, "consignor", {
  "consignor": {loading: true, load: loadConsignor },
  "items": {load: searchItems}
})
