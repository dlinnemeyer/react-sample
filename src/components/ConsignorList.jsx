import React, {PropTypes} from 'react';
import {displayName as consignorDisplayName,linkPath} from '../models/consignor';
import Address from './Address';
import {Link} from 'react-router';

const ConsignorList = React.createClass({
  render: function() {
    const consignors = this.props.consignors;
    return <table><tbody>
      {Object.keys(consignors).filter(c => consignors[c]).map(c => {
        const consignor = consignors[c];
        const del = () => this.props.deleteConsignor(consignor);
        return (
          <tr key={consignor.id}>
            <td><Link to={linkPath(consignor)}>{displayName(consignor)}</Link></td>
            <td>{consignor.items.length} items</td>
            <td>{consignor.isStoreAccount}</td>
            <td>{consignor.defaultPercSplit}</td>
            <td>{consignor.address} {consignor.address2}</td>
            <td>{consignor.city}</td>
            <td>{consignor.state}</td>
            <td>{consignor.zip}</td>
            <td><a href='#' onClick={del}>delete</a></td>
          </tr>
        )
      })}
    </tbody></table>;
  }
});

ConsignorList.propTypes = {
  deleteConsignor: PropTypes.func.isRequired
}

export default ConsignorList;
