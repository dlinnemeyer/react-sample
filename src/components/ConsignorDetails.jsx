import React from 'react'
import {displayName, propType, linkPath} from '../models/consignor'
import Address from './Address'
import {Link} from 'react-router'

export default function ConsignorDetails({consignor}){
  return <div>
    <h2>{displayName(consignor)}</h2>
    <Link to={linkPath(consignor, "edit")}>edit</Link>
    <Address name={displayName(consignor)} {...consignor} />
  </div>
}
ConsignorDetails.propTypes = {consignor: propType}
