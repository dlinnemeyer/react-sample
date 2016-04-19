import React, {PropTypes} from 'react';
import {displayName} from '../models/item';
import * as consignor from '../models/consignor';
import {Link} from 'react-router';

const ItemList = React.createClass({
  render: function() {
    const del = () => this.props.deleteItem(this.props.item);
    return <div>
      <h2>{displayName(this.props.item)}</h2>
      <p><a href='#' onClick={del}>delete</a></p>
      <p>${this.props.item.price}</p>
      <p><Link to={consignor.linkPath(this.props.consignor)}>
        {consignor.displayName(this.props.consignor)}
      </Link></p>
    </div>;
  }
});

ItemList.propTypes = {
  deleteItem: PropTypes.func.isRequired
}

export default ItemList;
