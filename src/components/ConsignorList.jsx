import React from 'react';
import {displayName,linkPath} from '../models/consignor';
import Address from './Address';
import {Link} from 'react-router';

export default React.createClass({
  render: function() {
    return <div>
      {this.props.consignors.toList().map(consignor =>
        <div className="consignor" key={consignor.get("id")}>
          <h3><Link to={linkPath(consignor)}>{displayName(consignor)}</Link></h3>
          <p>{consignor.get("items").count()} items</p>
          <Address name={displayName(consignor)} {...consignor.toJS()} />
        </div>
      )}
    </div>;
  }
});
