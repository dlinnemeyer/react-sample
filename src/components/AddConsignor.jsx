import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import AddConsignorForm from './AddConsignorForm'
import {addConsignor} from '../actions/consignors'
import {browserHistory} from 'react-router'

export const AddConsignor = React.createClass({
  propTypes: {
    addConsignor: PropTypes.func.isRequired
  },

  onSubmit(data){
    // should we just dispatch(addConsignor(data)) instead of doing the redux-action-binding thing?
    // seems more transparent?
    // return the promise for the form to handle. they'll need to be able to handle error display
    return this.props.addConsignor(data)
      .then(() => browserHistory.push('/consignors'))
      .catch((err) => {
        // the format we return here is for redux-form
        let formErr = {}
        switch(err.title){
          case 'duplicate_email':
            formErr = {email: "That email is already in use by another consignor."}
            break
          default:
            formErr = {_error: "There was a problem entering that consignor into the system. Please try again."}
            break
        }
        return Promise.reject(formErr)
      })
  },

  render(){
    return <AddConsignorForm onSubmit={this.onSubmit} />
  }
})

export const AddConsignorContainer = connect(undefined, {addConsignor})(AddConsignor)
