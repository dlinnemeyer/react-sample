import React, {PropTypes} from 'react'
import {displayName as displayName, linkPath, propType as consignorPropType} from '../models/consignor'
import {Link} from 'react-router'

const fields = ["displayName", "email", "itemCount", "isStoreAccount", "defaultPercSplit",
  "address", "city", "state", "zip"]

const ConsignorRow = React.createClass({
  propTypes: {
    del: PropTypes.func.isRequired,
    consignor: consignorPropType
  },

  del(){
    this.props.del(this.props.consignor)
  },

  render(){
    const { consignor } = this.props
    return <tr key={consignor.id}>
      <td><Link to={linkPath(consignor)}>{displayName(consignor)}</Link></td>
      <td>{consignor.email}</td>
      <td>{consignor.items.length} items</td>
      <td>{consignor.isStoreAccount ? "store" : "consignor"}</td>
      <td>{consignor.defaultPercSplit}</td>
      <td>{consignor.address} {consignor.address2}</td>
      <td>{consignor.city}</td>
      <td>{consignor.state}</td>
      <td>{consignor.zip}</td>
      <td><a href="#" onClick={this.del}>delete</a></td>
    </tr>
  }
})

const Heading = React.createClass({
  propTypes: {
    sort: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    sorted: PropTypes.bool.isRequired
  },

  sort(){
    this.props.sort(this.props.field)
  },

  render(){
    const field = this.props.sorted
      ? `${this.props.field} \\/`
      : this.props.field

    return <th style={{textAlign: "left"}}>
      <span style={{cursor: "pointer"}} onClick={this.sort}>{field}</span>
    </th>
  }

})

function ConsignorList(props){
  const {consignors, sort, deleteConsignor, currentSort} = props
  return <table>
  <thead>
    <tr>
      {fields.map(field => {
        return <Heading field={field} key={field} sort={sort} sorted={currentSort == field} />
      })}
      <th></th>
    </tr>
  </thead>
  <tbody>
    {Object.keys(consignors).filter(c => consignors[c]).map(c => {
      return <ConsignorRow key={c} consignor={consignors[c]} del={deleteConsignor} />
    })}
  </tbody></table>
}
ConsignorList.propTypes = {
  deleteConsignor: PropTypes.func.isRequired,
  sort: PropTypes.func.isRequired,
  consignors: PropTypes.objectOf(consignorPropType),
  currentSort: PropTypes.string.isRequired
}

export default ConsignorList
