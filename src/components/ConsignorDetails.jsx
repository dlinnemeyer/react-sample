import React from 'react';
import {displayName} from '../models/consignor';
import Address from './Address'

export default React.createClass({
  render: function() {
    return <div>
      <h2>{displayName(this.props.consignor)}</h2>
      <Address name={displayName(this.props.consignor)} {...this.props.consignor} />
    </div>;
  }
});
