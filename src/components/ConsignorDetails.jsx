import React from 'react'
import {displayName, propType} from '../models/consignor'
import Address from './Address'

export default function ConsignorDetails({consignor}){
  return <div>
    <h2>{displayName(consignor)}</h2>
    <Address name={displayName(consignor)} {...consignor} />
  </div>
}
ConsignorDetails.propTypes = {consignor: propType}
