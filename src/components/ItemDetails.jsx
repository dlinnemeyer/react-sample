import React, {PropTypes} from 'react'
import {displayName as itemDisplayName} from '../models/item'
import {linkPath, displayName} from '../models/consignor'
import {Link} from 'react-router'

const ItemList = React.createClass({
  render: function() {
    const del = () => this.props.deleteItem(this.props.item)
    return <div>
      <h2>{itemDisplayName(this.props.item)}</h2>
      <p><a href="#" onClick={del}>delete</a></p>
      <p>${this.props.item.price}</p>
      <p><Link to={linkPath(this.props.consignor)}>
        {displayName(this.props.consignor)}
      </Link></p>
    </div>
  }
})

ItemList.propTypes = {
  deleteItem: PropTypes.func.isRequired
}

export default ItemList
