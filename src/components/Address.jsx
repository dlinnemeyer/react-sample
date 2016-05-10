import React from 'react'

export default React.createClass({
  addressDisplay(){
    return this.props.address2
      ? `${this.props.address} ${this.props.address2}`
      : this.props.address
  },
  render: function() {
    return <p>
      {this.props.name}<br />
      {this.addressDisplay()}<br />
      {this.props.city}, {this.props.state} {this.props.zip}
    </p>
  }
})
