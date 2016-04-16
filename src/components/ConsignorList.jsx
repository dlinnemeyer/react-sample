import React from 'react';
import {displayName,linkPath} from '../models/consignor';
import Address from './Address';
import {Link} from 'react-router';

export default React.createClass({
  render: function() {
    let consignors = this.props.consignors;
    return <div>
      {Object.keys(consignors).filter(c => consignors[c]).map(c => {
        let consignor = consignors[c];
        return (
          <div className="consignor" key={consignor.id}>
            <h3><Link to={linkPath(consignor)}>{displayName(consignor)}</Link></h3>
            <p>{consignor.items.length} items</p>
            <Address name={displayName(consignor)} {...consignor} />
          </div>
        )
      })}
    </div>;
  }
});
