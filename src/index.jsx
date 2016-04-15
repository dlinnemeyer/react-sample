import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers/index';
import {initialState} from './initialState.js';
import {fromJS} from 'immutable'
import persistState from 'redux-localstorage'
import routes from './routes';
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

let middleware = [thunk];
if(process.env.NODE_ENV !== 'production') middleware.push(require('redux-immutable-state-invariant')());

const createStoreWithMiddleware = compose(
  persistState(),
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithMiddleware(combineReducers(reducers), initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
