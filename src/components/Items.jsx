import React from 'react'
import {connect} from 'react-redux'
import ItemList from './ItemList'
import ItemListFilter from './ItemListFilter'
import {addFakeItems, deleteAllItems} from '../actions/items'
import {search as searchItems} from '../data/items'
import {Link, withRouter} from 'react-router'
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {pick, isEqual} from 'lodash/fp'
import {asyncify} from '../lib/asyncify'
import Error from './Error'

const itemFields = ["id", "sku", "title", "brand", "color", "size", "description",
  "percSplit", "price", "printed"]

function searchItemsWrapped(settings){
  console.log("calling my async func")
  const { sortBy, page } = settings
  const filters = filterThemSettingsToTheFilters(settings)
  return searchItems(filters, sortBy, {perPage: 30, page})
}

function filterThemSettingsToTheFilters(settings){
  return pick(itemFields, settings)
}

export const Items = React.createClass({

  onFilterSubmit(data){
    this.props.items.setSettings(data)
  },

  paginate(pageNumber){
    this.props.items.setSettings({page: pageNumber})
  },

  sort(field){
    this.props.items.setSettings({sortBy: field})
  },

  render() {
    const {items, addFakeItems, deleteAllItems} = this.props
    const { page } = items.settings
    const filters = filterThemSettingsToTheFilters(items.settings)
    const _addFakeItems = e => { e.preventDefault(); addFakeItems() }
    const _deleteAllItems = e => { e.preventDefault(); deleteAllItems() }

    const itemsContent = items.loading
      ? <InnerLoading />
      : (<div>
        <Pagination total={items.data.count} pages={items.data.pages} page={parseInt(page)} onPage={this.paginate} />
        <ItemList items={items.data.items} sort={this.sort} />
      </div>)

    return <div>
      <Link to="/items/new">Add Item</Link><br />
      <Link to={{pathname: "/items", query: {"printed": "0"}}}>Unprinted Items</Link><br />
      <a href="#" onClick={_addFakeItems}>Add Lots O' Items</a><br />
      <a href="#" onClick={_deleteAllItems}>Delete All</a>
      <ItemListFilter initialValues={filters} onSubmit={this.onFilterSubmit} />
      {items.error
        ? <Error message={items.error.title} />
        : itemsContent}
    </div>
  }

})

const ReduxedItems = connect(undefined, {
  addFakeItems, deleteAllItems
})(withRouter(Items))

export const ItemsContainer = asyncify(ReduxedItems, "itemslist", {
  "items": {
    loading: true, load: searchItemsWrapped, onLoad: true, onChange: true,
    settings: { page: 1, sortBy: "displayName" }
  }
})
