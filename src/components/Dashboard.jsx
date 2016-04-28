import React from 'react';
import {connect} from 'react-redux';
import BasicStats from './BasicStats';

export const Dashboard = React.createClass({
  render: function() {
    return <div>
      <p>This is the dashboard!</p>
      <BasicStats consignorCount={this.props.consignorCount} itemCount={this.props.itemCount} />
    </div>;
  }
});

function mapStateToProps(state){
  return {
    consignorCount: Object.keys(state.consignors).length,
    itemCount: Object.keys(state.items).length
  }
}

export const DashboardContainer = connect(mapStateToProps)(Dashboard);
