import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    address: PropTypes.string.isRequired,
    address2: PropTypes.string,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired
  },
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
