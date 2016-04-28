import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import GlobalError from './GlobalError';

export const App = React.createClass({
  render: function() {
    return <div id='wrapper'>
      <nav>
        <Link to='/'>Dashboard</Link>{" "}
        <Link to='/consignors'>Consignors</Link>{" "}
        <Link to='/items'>Items</Link>
      </nav>
      {this.props.globalError && <GlobalError message={this.props.globalError} />}
      {this.props.children}
    </div>
  }
});

function mapStateToProps(state) {
  return {
    globalError: state.error.global
  }
}

export const AppContainer = connect(mapStateToProps)(App);
