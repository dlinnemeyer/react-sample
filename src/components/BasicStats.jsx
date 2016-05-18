import React, {PropTypes} from 'react'

export default function BasicStats({consignorCount, itemCount}){
  return <div>
    <p>{consignorCount} consignors</p>
    <p>{itemCount} items</p>
  </div>
}
BasicStats.propTypes = {
  consignorCount: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired
}
