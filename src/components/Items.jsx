import React from 'react'
import {connect} from 'react-redux'
import ItemList from './ItemList'
import ConsignorListFilter from './ConsignorListFilter'
import {searchItems, addFakeItems, deleteAllItems} from '../actions/items'
import {Link, withRouter} from 'react-router'
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {pick} from 'lodash/fp'
import {asyncify} from '../lib/asyncify'

const itemFields = ["id", "sku", "title", "brand", "color", "size", "description",
  "percSplit", "price"]

export const Items = React.createClass({

  loadItems(data){
    const mergedData = Object.assign({}, this.props.userSettings, data)

    this.props.dispatch({type: "loadItems push", mergedData, data: this.props})
    this.props.router.push({pathname: '/items', mergedData})

    const { sortBy, page } = mergedData
    const filters = pick(itemFields, mergedData)

    this.props.dispatch({type: "loading items", mergedData, data: this.props})
    return this.props.items.load(filters, sortBy, {perPage: 30, page})
  },

  componentWillMount(){
    this.loadItems()
  },

  onFilterSubmit(data){
    this.loadItems(data)
  },

  paginate(pageNumber){
    this.loadItems({page: pageNumber})
  },

  sort(field){
    this.loadItems({sortBy: field})
  },

  render() {
    const {items, addFakeItems, deleteAllItems, userSettings} = this.props
    const _addFakeItems = e => { e.preventDefault(); addFakeItems() }
    const _deleteAllItems = e => { e.preventDefault(); deleteAllItems() }
    return <div>
      <Link to="/items/new">Add Item</Link><br />
      <Link to={{pathname: "/items", query: {"printed": "0"}}}>Unprinted Items</Link><br />
      <a href="#" onClick={_addFakeItems}>Add Lots O' Items</a><br />
      <a href="#" onClick={_deleteAllItems}>Delete All</a>
      {items.loading
        ? <InnerLoading />
        : <ItemList items={items.data.items} sort={this.sort} />}
    </div>
  }

})

function mapStateToProps(state, props){
  const userSettings = Object.assign({
    page: "1",
    sortBy: "sku"
  }, props.location.query)

  return {
    userSettings
  }
}

const ReduxedItems = connect(mapStateToProps, {
  addFakeItems, deleteAllItems
})(withRouter(Items))

export const ItemsContainer = asyncify(ReduxedItems, "itemslist", {
  "items": { data: {}, loading: true, load: searchItems }
})
