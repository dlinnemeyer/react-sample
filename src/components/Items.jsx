import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import ItemList from './ItemList'
import ItemListFilter from './ItemListFilter'
import {addFakeItems, deleteAllItems} from '../actions/items'
import {search as searchItems} from '../data/items'
import {Link} from 'react-router'
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {pick, concat} from 'lodash'
import {asyncify, channelPropType} from '../lib/asyncify/components'
import Error from './Error'

const itemFields = ["sku", "title", "brand", "color", "size", "description",
  "percSplit", "price", "printed"]

function searchItemsWrapped(settings){
  const { sortBy, page } = settings
  const filters = filterThemSettingsToTheFilters(settings)
  return searchItems(filters, sortBy, {perPage: 30, page})
}

function filterThemSettingsToTheFilters(settings){
  return pick(settings, itemFields)
}

export const Items = React.createClass({
  propTypes: {
    items: channelPropType,
    addFakeItems: PropTypes.func.isRequired,
    deleteAllItems: PropTypes.func.isRequired
  },

  onFilterSubmit(data){
    this.props.items.mergeSettings(data)
  },

  paginate(pageNumber){
    this.props.items.mergeSettings({page: pageNumber})
  },

  sort(field){
    this.props.items.mergeSettings({sortBy: field})
  },

  addFake(evt){
    evt.preventDefault()
    this.props.addFakeItems()
  },

  deleteAll(evt){
    evt.preventDefault()
    this.props.deleteAllItems()
  },

  render() {
    const {items} = this.props
    const { page } = items.settings
    const filters = filterThemSettingsToTheFilters(items.settings)

    let itemsContent
    if(items.error){
      itemsContent = <Error message={items.error.title} />
    }
    else {
      itemsContent = items.loading
        ? <InnerLoading />
        : (<div>
          <Pagination total={items.data.count} pages={items.data.pages} page={parseInt(page)} onPage={this.paginate} />
          <ItemList items={items.data.items} sort={this.sort} currentSort={items.settings.sortBy} />
        </div>)
    }

    return <div>
      <Link to="/items/new">Add Item</Link><br />
      <Link to={{pathname: "/items", query: {"printed": "0"}}}>Unprinted Items</Link><br />
      <a href="#" onClick={this.addFake}>Add Lots O' Items</a><br />
      <a href="#" onClick={this.deleteAll}>Delete All</a>
      <ItemListFilter initialValues={filters} onSubmit={this.onFilterSubmit} />
      {itemsContent}
    </div>
  }

})

const ReduxedItems = connect(undefined, {
  addFakeItems, deleteAllItems
})(Items)

export const ItemsContainer = asyncify(ReduxedItems, "itemslist", {
  "items": {
    loading: true, load: searchItemsWrapped, onLoad: true, onChange: true,
    // TODO: maybe switch this out to have a settings object, and each setting key can set
    // defaultValue, syncToQueryString, etc? could include datatype for serialization, de-serialization
    settings: { page: 1, sortBy: "title" },
    settingsToQueryString: concat(itemFields, ["page", "sortBy"])
  }
})
