import React, {PropTypes} from 'react';
import {displayName as displayName,linkPath} from '../models/consignor';
import Address from './Address';
import {Link} from 'react-router';

const fields = ["displayName", "email", "itemCount", "isStoreAccount", "defaultPercSplit",
  "address", "city", "state", "zip"];

const ConsignorList = React.createClass({
  render: function() {
    const {consignors, sort} = this.props;
    return <table>
    <thead>
      <tr>
        {fields.map(field => {
        return (<th key={field} style={{textAlign: "left"}}>
          <span style={{cursor: "pointer"}} onClick={() => sort(field)}>{field}</span>
        </th>
        )})}
        <th></th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(consignors).filter(c => consignors[c]).map(c => {
        const consignor = consignors[c];
        const del = () => this.props.deleteConsignor(consignor);
        return (
          <tr key={consignor.id}>
            <td><Link to={linkPath(consignor)}>{displayName(consignor)}</Link></td>
            <td>{consignor.email}</td>
            <td>{consignor.items.length} items</td>
            <td>{consignor.isStoreAccount ? "store" : "consignor"}</td>
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
  deleteConsignor: PropTypes.func.isRequired,
  sort: PropTypes.func.isRequired
}

export default ConsignorList;
