import React from 'react'
import ItemForm from './ItemForm'
import {add as addItem} from '../data/items'
import {getAll as getAllConsignors} from '../data/consignors'
import {browserHistory} from 'react-router'
import {asyncify, channelPropType} from '../lib/asyncify/components'
import Error from './Error'
import InnerLoading from './InnerLoading'

export const AddItem = React.createClass({
  propTypes: {
     consignors: channelPropType
  },

  componentWillMount(){
    this.props.consignors.load()
  },

  onSubmit(data){
    // should we route this through asyncify so we make sure all async calls are through
    // one method? that'd allow us to do things like add middleware that listens for component
    // errors and convert some to global errors?
    return addItem(data)
      .then(() => browserHistory.push('/items'))
      .catch((err) => {
        // the format we return here is for redux-form
        let formErr = {}
        switch(err.title){
          case 'duplicate_sku':
            formErr = {sku: "That sku is already being used."}
            break
          default:
            formErr = {_error: "There was a problem entering that item into the system. Please try again."}
            break
        }
        return Promise.reject(formErr)
      })
  },

  render: function() {
    const {consignors} = this.props
    // we're in confusing land now, since we're using both reduxForm and asyncify.
    // the form has its own loading state for when it's submitted, but we have an outer
    // async function called before the form ever shows up.
    // I mean, it works, but my brain bends a bit
    if(consignors.error) return <Error message={consignors.error.title} />

    return consignors.loading
      ? <InnerLoading />
      : <ItemForm onSubmit={this.onSubmit} consignors={consignors.data} />
  }
})

export const AddItemContainer = asyncify(AddItem, "additem", {
  "consignors": {loading: true, load: getAllConsignors}
})
