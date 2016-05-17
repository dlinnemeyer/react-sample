import React, {PropTypes} from 'react'
import ItemDetails from './ItemDetails'
import {deleteItem, loadItem} from '../actions/items'
import {loadConsignor} from '../actions/consignors'
import LoadingOverlay from './LoadingOverlay'
import {browserHistory} from 'react-router'
import InnerLoading from './InnerLoading'
import {asyncify} from '../lib/asyncify/components'
import Error from './Error'

export const Item = React.createClass({
  id(){
    return this.props.params.itemid
  },

  componentWillMount(){
    this.props.item.load(this.id()).then((item) => this.props.consignor.load(item.consignorid))
  },

  deleteItem(item){
    this.props.del(item.id).then(() => browserHistory.push('/items'))
  },

  render: function() {
    const { del, item, consignor } = this.props

    if(item.error) return <Error message={item.error.title} />

    return <div>
      {item.loading || consignor.loading
        ? <InnerLoading />
        : <ItemDetails item={item.data} consignor={consignor.data} deleteItem={this.deleteItem} />}
      {del.loading && <LoadingOverlay />}
    </div>
  }
})

Item.propTypes = {
  consignor: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  del: PropTypes.object.isRequired
}

export const ItemContainer = asyncify(Item, "item", {
  "consignor": {load: loadConsignor },
  "item": {loading: true, load: loadItem},
  "del": {load: deleteItem}
})
