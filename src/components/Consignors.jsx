import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import ConsignorList from './ConsignorList'
import ConsignorListFilter from './ConsignorListFilter'
import {Link} from 'react-router'
import {deleteAllConsignors, addFakeConsignors} from '../actions/consignors'
import {del as deleteConsignor, search as searchConsignors} from '../data/consignors'
import InnerLoading from './InnerLoading'
import Error from './Error'
import Pagination from './Pagination'
import {pick, concat} from 'lodash'
import {asyncify, channelPropType} from '../lib/asyncify/components'

const consignorFields = ["firstName", "lastName", "company", "isStoreAccount", "defaultPercSplit",
  "address", "address2", "city", "state", "zip", "email"]

function searchConsignorsWrapped(settings){
  const { sortBy, page } = settings
  const filters = filterThemSettingsToTheFilters(settings)
  return searchConsignors(filters, sortBy, {perPage: 30, page})
}

function filterThemSettingsToTheFilters(settings){
  return pick(settings, consignorFields)
}

export const Consignors = React.createClass({
  propTypes: {
    consignors: channelPropType,
    deleteConsignor: channelPropType,
    deleteAllConsignors: PropTypes.func.isRequired,
    addFakeConsignors: PropTypes.func.isRequired
  },

  deleteConsignor(consignor){
    this.props.deleteConsignor.load(consignor)
      .then(() => this.props.consignors.load(this.props.consignors.settings))
  },

  onFilterSubmit(data){
    this.props.consignors.mergeSettings(data)
  },

  paginate(page){
    this.props.consignors.mergeSettings({page})
  },

  sort(sortBy){
    this.props.consignors.mergeSettings({sortBy})
  },

  anyLoading(){
    return this.props.consignors.loading || this.props.deleteConsignor.loading
  },

  addFake(evt){
    evt.preventDefault()
    this.props.addFakeConsignors()
  },

  deleteAll(evt){
    evt.preventDefault()
    this.props.deleteAllConsignors()
  },

  render() {
    const {consignors} = this.props
    const { page } = consignors.settings
    const filters = filterThemSettingsToTheFilters(consignors.settings)

    let consignorsContent
    if(consignors.error){
      consignorsContent = <Error message={consignors.error.title} />
    }
    else {
      consignorsContent = this.anyLoading()
        ? <InnerLoading />
        : (<div>
          <Pagination total={consignors.data.count} pages={consignors.data.pages} page={parseInt(page)} onPage={this.paginate} />
          <ConsignorList consignors={consignors.data.consignors} sort={this.sort} deleteConsignor={this.deleteConsignor} currentSort={consignors.settings.sortBy} />
        </div>)
    }
    return <div>
      <Link to="/consignors/new">Add Consignor</Link><br />
      <Link to={{pathname: "/consignors", query: {"isStoreAccount": "1"}}}>Store Accounts</Link><br />
      <a href="#" onClick={this.addFake}>Add Lots O' Consignors</a><br />
      <a href="#" onClick={this.deleteAll}>Delete All</a>
      <ConsignorListFilter initialValues={filters} onSubmit={this.onFilterSubmit} refs="filterConsignorsForm" />
      {consignorsContent}
    </div>
  }
})

const ReduxedConsignors = connect(undefined, {
  addFakeConsignors, deleteAllConsignors
})(Consignors)

export const ConsignorsContainer = asyncify(ReduxedConsignors, "consignorslist", {
  "consignors": {
    loading: true, load: searchConsignorsWrapped, onLoad: true, onChange: true,
    settings: {page: 1, sortBy: "displayName"},
    settingsToQueryString: concat(consignorFields, ["page", "sortBy"])
  },
  "deleteConsignor": { load: deleteConsignor }
})
