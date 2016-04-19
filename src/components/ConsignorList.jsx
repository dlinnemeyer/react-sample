import React, {PropTypes} from 'react';
import {displayName,linkPath} from '../models/consignor';
import Address from './Address';
import {Link} from 'react-router';

const ConsignorList = React.createClass({
  render: function() {
    const consignors = this.props.consignors;
    return <div>
      {Object.keys(consignors).filter(c => consignors[c]).map(c => {
        const consignor = consignors[c];
        const del = () => this.props.deleteConsignor(consignor);
        return (
          <div className="consignor" key={consignor.id}>
            <h3><Link to={linkPath(consignor)}>{displayName(consignor)}</Link></h3>
            <p><a href='#' onClick={del}>delete</a></p>
            <p>{consignor.items.length} items</p>
            <Address name={displayName(consignor)} {...consignor} />
          </div>
        )
      })}
    </div>;
  }
});

ConsignorList.propTypes = {
  deleteConsignor: PropTypes.func.isRequired
}

export default ConsignorList;
