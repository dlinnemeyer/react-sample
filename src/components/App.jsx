import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

export const App = React.createClass({
  render: function() {
    return <div id='wrapper'>
      <Link to='/consignors'>Consignors</Link>{" "}
      <Link to='/items'>Items</Link>
      {this.props.children}
      {this.props.loading ?
        <div id='loading'>loading...</div> :
        null}
    </div>
  }
});

function mapStateToProps(state) {
  return {
    loading: state.get('loading')
  };
}

export const AppContainer = connect(mapStateToProps)(App);
