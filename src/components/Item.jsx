import React, {PropTypes} from 'react'
import ItemDetails from './ItemDetails'
import {get as getItem, del as deleteItem} from '../data/items'
import {get as getConsignor} from '../data/consignors'
import LoadingOverlay from './LoadingOverlay'
import {browserHistory} from 'react-router'
import InnerLoading from './InnerLoading'
import {asyncify, channelPropType} from '../lib/asyncify/components'
import Error from './Error'

export const Item = React.createClass({
  propTypes: {
    consignor: channelPropType,
    item: channelPropType,
    del: channelPropType,
    params: PropTypes.shape({
      itemid: PropTypes.string.isRequired
    }).isRequired
  },

  id(){
    return this.props.params.itemid
  },

  componentWillMount(){
    this.props.item.load(this.id())
      .then(item => this.props.consignor.load(item.consignorid))
  },

  deleteItem(item){
    this.props.del.load(item)
      .then(() => browserHistory.push('/items'))
  },

  render: function() {
    const { del, item, consignor } = this.props

    if(item.error) return <Error message={item.error.title} />
    if(consignor.error) return <Error message={consignor.error.title} />

    return <div>
      {item.loading || consignor.loading
        ? <InnerLoading />
        : <ItemDetails item={item.data} consignor={consignor.data} deleteItem={this.deleteItem} />}
      {del.loading && <LoadingOverlay />}
    </div>
  }
})

export const ItemContainer = asyncify(Item, "item", {
  "consignor": {loading: true, load: getConsignor },
  "item": {loading: true, load: getItem},
  "del": {load: deleteItem}
})
