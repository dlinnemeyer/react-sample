import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import {createStore,applyMiddleware,compose} from 'redux';
import {Provider} from 'react-redux';
import remote from './remote_middleware/remote.js';
import reducer from './reducers/reducer';
import {AppContainer} from './components/App';
// import {ItemsContainer} from './components/Items';
import {ConsignorsContainer} from './components/Consignors';
import {ConsignorContainer} from './components/Consignor';
import {DashboardContainer} from './components/Dashboard';
import {initialState} from './initialState.js';
import {fromJS} from 'immutable'

const createStoreWithMiddleware = compose(
  applyMiddleware(remote),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithMiddleware(reducer);
store.dispatch({
  type: 'SET_STATE',
  state: fromJS(initialState)
});

const routes = <Route component={AppContainer}>
  <Route path="/" component={DashboardContainer} />
  <Route path="/consignors" component={ConsignorsContainer} />
  <Route path="/consignors/:consignorId" component={ConsignorContainer} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
