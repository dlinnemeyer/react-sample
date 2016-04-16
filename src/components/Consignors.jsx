import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList'
import {Link} from 'react-router';

export const Consignors = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div>
      <Link to="/consignors/new">Add Consignor</Link>
      <ConsignorList consignors={this.props.consignors} />
    </div>;
  }
});

function mapStateToProps(state){
  return {
    consignors: state.consignors
  }
}

export const ConsignorsContainer = connect(mapStateToProps)(Consignors);
