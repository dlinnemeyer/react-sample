import React from 'react'
import ReactDOM from 'react-dom'
import {Router, browserHistory} from 'react-router'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import reducers from './reducers/index'
import {initialState} from './initialState.js'
import routes from './routes'
import thunk from 'redux-thunk'
import {syncHistoryWithStore, routerReducer, routerMiddleware, push} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'
import createLogger from 'redux-logger'
import {queryStringMiddleware} from './lib/asyncify'

let middleware = [thunk, routerMiddleware(browserHistory), queryStringMiddleware(push)]
if(process.env.NODE_ENV !== 'production'){
  middleware.push(require('redux-immutable-state-invariant')())
  middleware.push(createLogger({collapsed: true}))
}

const createStoreWithMiddleware = compose(
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

reducers.routing = routerReducer
reducers.form = formReducer
const store = createStoreWithMiddleware(combineReducers(reducers), initialState)

const history = syncHistoryWithStore(browserHistory, store)
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
)
