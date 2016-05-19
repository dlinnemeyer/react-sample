import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {AppContainer} from './components/App'
import {ItemsContainer} from './components/Items'
import {ItemContainer} from './components/Item'
import {AddItemContainer} from './components/AddItem'
import {EditItemContainer} from './components/EditItem'
import {ConsignorsContainer} from './components/Consignors'
import {ConsignorContainer} from './components/Consignor'
import {DashboardContainer} from './components/Dashboard'
import {AddConsignorContainer} from './components/AddConsignor'
import {EditConsignorContainer} from './components/EditConsignor'

export default <Route path="/" component={AppContainer}>
  <IndexRoute component={DashboardContainer} />
  <Route path="/consignors" component={ConsignorsContainer} />
  <Route path="/consignors/new" component={AddConsignorContainer} />
  <Route path="/consignors/:consignorid" component={ConsignorContainer} />
  <Route path="/consignors/:consignorid/edit" component={EditConsignorContainer} />
  <Route path="/items" component={ItemsContainer} />
  <Route path="/items/new" component={AddItemContainer} />
  <Route path="/items/:itemid" component={ItemContainer} />
  <Route path="/items/:itemid/edit" component={EditItemContainer} />
</Route>
