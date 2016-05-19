import React, {PropTypes} from 'react'
import ConsignorForm from './ConsignorForm'
import {get as getConsignor, edit as editConsignor} from '../data/consignors'
import {browserHistory} from 'react-router'
import {linkPath} from '../models/consignor'
import {asyncify, channelPropType} from '../lib/asyncify/components'
import InnerLoading from './InnerLoading'
import Error from './Error'
import {assign} from 'lodash'

export const EditConsignor = React.createClass({
  propTypes: {
    consignor: channelPropType,
    params: PropTypes.shape({
      consignorid: PropTypes.string.isRequired
    }).isRequired
  },

  id(){
    return this.props.params.consignorid
  },

  componentWillMount(){
    this.props.consignor.load(this.id())
  },

  onSubmit(data){
    // TODO: we really should be routing editConsignor through asyncify? but is that redundant
    // with reduxForm? because this onSubmit bit is wrapped up in loading/submitting/error action
    // stuff, like asyncify
    return editConsignor(assign({}, data, {id: this.id()}))
      .then(consignor => browserHistory.push(linkPath(consignor)))
      .catch((err) => {
        // the format we return here is for redux-form
        let formErr = {}
        switch(err.title){
          case 'duplicate_email':
            formErr = {_error: "That email is already in use by another consignor."}
            break
          case 'invalid_consignorid':
            formErr = {email: "That's an invalid consignor."}
            break
          default:
            formErr = {_error: "There was a problem entering that consignor into the system. Please try again."}
            break
        }
        return Promise.reject(formErr)
      })
  },

  render(){
    const { consignor: { loading, data: consignor, error } } = this.props
    if(error) return <Error message={error.title} />

    return loading
      ? <InnerLoading />
      : <ConsignorForm onSubmit={this.onSubmit} initialValues={consignor} />
  }
})

export const EditConsignorContainer = asyncify(EditConsignor, "editconsignor", {
  "consignor": {loading: true, load: getConsignor}
})
