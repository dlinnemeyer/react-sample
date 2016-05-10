import React from 'react'
import {connect} from 'react-redux'
import ConsignorList from './ConsignorList'
import ConsignorListFilter from './ConsignorListFilter'
import {Link} from 'react-router'
import {deleteConsignor, deleteAllConsignors, addFakeConsignors, searchConsignors}
  from '../actions/consignors'
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {isEqual} from 'lodash/fp'
import {asyncify} from '../lib/asyncify'
import {push, getQuery} from '../misc'

export const Consignors = React.createClass({

  deleteConsignor(id){
    this.props.deleteConsignor.load(id)
      .then(() => this.loadConsignors(undefined, true))
  },

  setUserSettings(data){
    const query = Object.assign({}, this.props.userSettings, data)
    push({pathname: '/consignors', query})
    this.loadConsignors(query)
  },

  componentWillMount(){
    this.loadConsignors()
  },

  componentWillReceiveProps(){
    this.loadConsignors()
  },

  lastSettingsLoad: undefined,
  loadConsignors(settings, force = false){
    if(!settings) settings = this.props.userSettings || {}
    if(!force && isEqual(this.lastSettingsLoad, settings)) return Promise.resolve()

    this.lastSettingsLoad = settings
    const { filters, sortBy, page } = settings

    return this.props.search.load(filters, sortBy, {perPage: 30, page})
  },

  onFilterSubmit(data){
    this.setUserSettings({filters: data})
  },

  paginate(page){
    this.setUserSettings({page})
  },

  sort(sortBy){
    this.setUserSettings({sortBy})
  },

  anyLoading(){
    return this.props.search.loading || this.props.deleteConsignor.loading
  },

  render() {
    const {search, consignors, addFakeConsignors, deleteAllConsignors, userSettings} = this.props

    const _addFakeConsignors = e => { e.preventDefault(); addFakeConsignors() }
    const _deleteAllConsignors = e => { e.preventDefault(); deleteAllConsignors() }
    return <div>
      <Link to="/consignors/new">Add Consignor</Link><br />
      <Link to={{pathname: "/consignors", query: {"filters[isStoreAccount]": "1"}}}>Store Accounts</Link><br />
      <a href="#" onClick={_addFakeConsignors}>Add Lots O' Consignors</a><br />
      <a href="#" onClick={_deleteAllConsignors}>Delete All</a>
      <ConsignorListFilter initialValues={userSettings.filters} onSubmit={this.onFilterSubmit} refs="filterConsignorsForm" />
      {this.anyLoading()
        ? <InnerLoading />
        : (<div>
            <Pagination total={search.data.count} pages={search.data.pages} page={parseInt(userSettings.page)} onPage={this.paginate} />
            <ConsignorList consignors={consignors} deleteConsignor={this.deleteConsignor}
              sort={this.sort} />
          </div>)}
    </div>
  }
})


function mapStateToProps(state, props){
  const userSettings = Object.assign({
    page: "1",
    sortBy: "displayName",
    filters: {}
  }, getQuery(props.location))

  // TODO: remove this. it's stupid. the action should just return the consignors themselves instead
  // of the ids?
  const consignors = props.search.data.ids.map(id => state.consignors[id])

  return {
    consignors,
    userSettings
  }
}

const ReduxedConsignors = connect(mapStateToProps, {
  addFakeConsignors, deleteAllConsignors
})(Consignors)

export const ConsignorsContainer = asyncify(ReduxedConsignors, "consignorslist", {
  "search": { data: {ids: []}, loading: true, load: searchConsignors },
  "deleteConsignor": { load: deleteConsignor }
})
