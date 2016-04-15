import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {createStore,applyMiddleware,compose} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers/reducer';
import {initialState} from './initialState.js';
import {fromJS} from 'immutable'
import persistState from 'redux-localstorage'
import routes from './routes';
import thunk from 'redux-thunk';


const createStoreWithMiddleware = compose(
  // this messy persistState stuff is just to handle merging and serializing immutableJS
  // data structures into a json string. it wouldn't need to be here if we went non-immutable
  persistState(undefined, {
    serialize: data => JSON.stringify(data.toJS()),
    deserialize: string => fromJS(JSON.parse(string)),
    merge: (initial, local) => {
      if(local.get("consignors").count()){
        initial = initial.set("consignors", local.get("consignors"));
      }
      if(local.get("items").count()){
        initial = initial.set("items", local.get("items"));
      }
      return initial;
    }
  }),
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithMiddleware(reducer, fromJS(initialState));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
