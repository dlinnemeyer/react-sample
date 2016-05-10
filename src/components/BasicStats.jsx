import React from 'react'

export default React.createClass({
  render: function() {
    return <div>
      <p>{this.props.consignorCount} consignors</p>
      <p>{this.props.itemCount} items</p>
    </div>
  }
})
