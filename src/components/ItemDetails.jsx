import React, {PropTypes} from 'react'
import {displayName as itemDisplayName, propType as itemPropType} from '../models/item'
import {linkPath, displayName, propType as consignorPropType} from '../models/consignor'
import {Link} from 'react-router'

export default React.createClass({
  propTypes: {
    item: itemPropType,
    consignor: consignorPropType,
    deleteItem: PropTypes.func.isRequired
  },

  del(){
    this.props.deleteItem(this.props.item)
  },

  render: function() {
    const {item, consignor} = this.props
    return <div>
      <h2>{itemDisplayName(item)}</h2>
      <p><a href="#" onClick={this.del}>delete</a></p>
      <p>${item.price}</p>
      <p><Link to={linkPath(consignor)}>
        {displayName(consignor)}
      </Link></p>
    </div>
  }
})
