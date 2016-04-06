import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import BasicStats from './BasicStats';

export const Dashboard = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div>
      <p>This is the dashboard!</p>
      <BasicStats consignorCount={this.props.consignorCount} itemCount={this.props.itemCount} />
    </div>;
  }
});

function mapStateToProps(state){
  return {
    consignorCount: state.get('consignors').count(),
    itemCount: state.get('items').count()
  }
}

export const DashboardContainer = connect(mapStateToProps)(Dashboard);
