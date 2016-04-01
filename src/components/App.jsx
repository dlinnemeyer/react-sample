import React from 'react';
import {connect} from 'react-redux';

export const App = React.createClass({
  render: function() {
    return <div id='wrapper'>
      {React.cloneElement(this.props.children)}
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
