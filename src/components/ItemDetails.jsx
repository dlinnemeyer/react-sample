import React from 'react';
import {displayName} from '../models/item';
import * as consignor from '../models/consignor';
import {Link} from 'react-router';

export default React.createClass({
  render: function() {
    console.log(this.props);

    return <div>
      <h2>{displayName(this.props.item)}</h2>
      <p>${this.props.item.get("price")}</p>
      <p><Link to={consignor.linkPath(this.props.consignor)}>
        {consignor.displayName(this.props.consignor)}
      </Link></p>
    </div>;
  }
});

