import React, {PropTypes} from 'react'
import ItemForm from './ItemForm'
import {get as getItem, edit as editItem} from '../data/items'
import {getAll as getAllConsignors} from '../data/consignors'
import {browserHistory} from 'react-router'
import {linkPath} from '../models/item'
import {asyncify, channelPropType} from '../lib/asyncify/components'
import InnerLoading from './InnerLoading'
import Error from './Error'
import {assign} from 'lodash'

export const EditItem = React.createClass({
  propTypes: {
    item: channelPropType,
    consignors: channelPropType,
    params: PropTypes.shape({
      itemid: PropTypes.string.isRequired
    }).isRequired
  },

  id(){
    return this.props.params.itemid
  },

  componentWillMount(){
    this.props.item.load(this.id())
    this.props.consignors.load()
  },

  onSubmit(data){
    return editItem(assign({}, data, {id: this.id()}))
      .then(item => browserHistory.push(linkPath(item)))
      .catch((err) => {
        // the format we return here is for redux-form
        let formErr = {}
        switch(err.title){
          case 'duplicate_sku':
            formErr = {sku: "That sku is already in use."}
            break
          case 'invalid_consignorid':
            formErr = {_error: "That's an invalid consignor."}
            break
          case 'invalid_itemid':
            formErr = {_error: "That's an invalid item."}
            break
          default:
            formErr = {_error: "There was a problem entering that consignor into the system. Please try again."}
            break
        }
        return Promise.reject(formErr)
      })
  },

  render(){
    const { item, consignors } = this.props
    const error = item.error || consignors.error
    if(error) return <Error message={error.title} />

    return item.loading || consignors.loading
      ? <InnerLoading />
      : <ItemForm onSubmit={this.onSubmit} initialValues={item.data} consignors={consignors.data} />
  }
})

export const EditItemContainer = asyncify(EditItem, "edititem", {
  "item": {loading: true, load: getItem},
  "consignors": {loading: true, load: getAllConsignors}
})
