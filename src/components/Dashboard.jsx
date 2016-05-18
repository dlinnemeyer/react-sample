import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import BasicStats from './BasicStats'

export function Dashboard({consignorCount, itemCount}){
  return <div>
    <p>This is the dashboard!</p>
    <BasicStats consignorCount={consignorCount} itemCount={itemCount} />
  </div>
}
Dashboard.propTypes = {
  consignorCount: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired
}

// need to get some real async calls together for this?
function mapStateToProps(){
  return {
    consignorCount: 17,
    itemCount: 23
  }
}

export const DashboardContainer = connect(mapStateToProps)(Dashboard)
