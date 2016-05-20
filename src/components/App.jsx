import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import GlobalError from './GlobalError'

const App = React.createClass({
  propTypes: {
    globalError: PropTypes.string,
    children: PropTypes.element
  },
  render: function() {
    return <div id="wrapper">
      <nav>
        <Link to="/">Dashboard</Link>{" "}
        <Link to="/consignors">Consignors</Link>{" "}
        <Link to="/items">Items</Link>{" "}
        <Link to="/sales/new">Add Sale</Link>
      </nav>
      {this.props.globalError && <GlobalError message={this.props.globalError} />}
      {this.props.children}
    </div>
  }
})

function mapStateToProps(state) {
  return {
    globalError: state.error.global
  }
}

export const AppContainer = connect(mapStateToProps)(App)
