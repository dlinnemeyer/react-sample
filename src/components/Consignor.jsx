import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import ConsignorDetails from './ConsignorDetails'
import ItemList from './ItemList'
import {get as getConsignor} from '../data/consignors'
import {search as searchItems} from '../data/items'
import InnerLoading from './InnerLoading'
import {asyncify} from '../lib/asyncify/components'
import Error from './Error'

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

    if(consignor.error) return <Error message={consignor.error.title} />
    if(items.error) return <Error message={items.error.title} />

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

export const ConsignorContainer = asyncify(Consignor, "consignor", {
  "consignor": {loading: true, load: getConsignor },
  "items": {load: searchItems}
})
