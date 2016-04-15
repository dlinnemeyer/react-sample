import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

export const App = React.createClass({
  render: function() {
    return <div id='wrapper'>
      <Link to='/'>Dashboard</Link>{" "}
      <Link to='/consignors'>Consignors</Link>{" "}
      <Link to='/items'>Items</Link>
      {this.props.children}
    </div>
  }
});

function mapStateToProps(state) {
  return {

  }
}

export const AppContainer = connect(mapStateToProps)(App);
