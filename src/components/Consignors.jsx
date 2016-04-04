import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ConsignorList from './ConsignorList'

export const Consignors = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <ConsignorList consignors={this.props.consignors} />;
  }
});

function mapStateToProps(state){
  return {
    consignors: state.get('consignors')
  }
}

export const ConsignorsContainer = connect(mapStateToProps)(Consignors);
