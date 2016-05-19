import React from 'react'
import ReactDOM from 'react-dom'
import {Router, browserHistory} from 'react-router'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import reducers from './reducers/index'
import {initialState} from './initialState'
import routes from './routes'
import thunk from 'redux-thunk'
import {syncHistoryWithStore, routerReducer, routerMiddleware, push} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'
import createLogger from 'redux-logger'
import {queryStringMiddleware} from './lib/asyncify/middleware'
import {reducer as asyncifyReducer} from './lib/asyncify/reducers'
import createRollbarMiddleware from './lib/rollbar/middleware'

const rollbarConfig = {
  accessToken: '7403dee08be242dea0d567fda8198d4e',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV
  }
}

const middleware = [
  createRollbarMiddleware(rollbarConfig, process.env.NODE_ENV),
  thunk,
  routerMiddleware(browserHistory),
  queryStringMiddleware(push)
]
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
reducers.components = asyncifyReducer
const store = createStoreWithMiddleware(combineReducers(reducers), initialState)

const history = syncHistoryWithStore(browserHistory, store)
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
)
