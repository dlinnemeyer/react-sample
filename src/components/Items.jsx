import React from 'react'
import {connect} from 'react-redux'
import ItemList from './ItemList'
import ItemListFilter from './ItemListFilter'
import {searchItems, addFakeItems, deleteAllItems} from '../actions/items'
import {Link, withRouter} from 'react-router'
import InnerLoading from './InnerLoading'
import Pagination from './Pagination'
import {isEqual, pick} from 'lodash/fp'
import {asyncify} from '../lib/asyncify'

const itemFields = ["id", "sku", "title", "brand", "color", "size", "description",
  "percSplit", "price", "printed"]

export const Items = React.createClass({

  loadItems(data){
    const mergedData = Object.assign({}, this.props.userSettings, data)
    this.props.router.push({pathname: '/items', query: mergedData})

    const { sortBy, page } = mergedData
    const filters = this.filterThemSettingsToTheFilters(mergedData)

    return this.props.items.load(filters, sortBy, {perPage: 30, page})
  },

  componentWillMount(){
    this.loadItems()
  },

  componentWillReceiveProps(next){
    console.log(next.userSettings, this.props.userSettings);
    if(!isEqual(next.userSettings, this.props.userSettings)) this.loadItems();
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

  filterThemSettingsToTheFilters(settings){
    return pick(itemFields, settings)
  },


  render() {
    const {items, addFakeItems, deleteAllItems, userSettings} = this.props
    const { page } = userSettings
    const filters = this.filterThemSettingsToTheFilters(userSettings)
    const _addFakeItems = e => { e.preventDefault(); addFakeItems() }
    const _deleteAllItems = e => { e.preventDefault(); deleteAllItems() }

    return <div>
      <Link to="/items/new">Add Item</Link><br />
      <Link to={{pathname: "/items", query: {"printed": "0"}}}>Unprinted Items</Link><br />
      <a href="#" onClick={_addFakeItems}>Add Lots O' Items</a><br />
      <a href="#" onClick={_deleteAllItems}>Delete All</a>
      <ItemListFilter initialValues={filters} onSubmit={this.onFilterSubmit} />
      {items.loading
        ? <InnerLoading />
        : (<div>
            <Pagination total={items.data.count} pages={items.data.pages} page={parseInt(page)} onPage={this.paginate} />
            <ItemList items={items.data.items} sort={this.sort} />
          </div>)}
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
