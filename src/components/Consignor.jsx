import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/consignor';
import ConsignorDetails from './ConsignorDetails'
import ItemList from './ItemList'
import {getConsignor} from '../actions/actions'

export const Consignor = React.createClass({
  mixins: [PureRenderMixin],

  id(){
    return this.props.params.consignorid;
  },

  componentWillMount(){
    this.props.getConsignorLoading(true);
    this.props.getConsignor(this.id())
      .then(consignor => {
        this.props.getConsignorLoading(false);
        // load items after loading consignor?
      })
  },

  render: function() {
    // TODO: if viewConsignor loading, display loading overlay
    return <div>
      <ConsignorDetails consignor={this.props.consignor} />
      <ItemList items={this.props.items} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
    loading: state.loading.pages.viewConsignor
  }
}

export const ConsignorContainer = connect(mapStateToProps, {
  getConsignor
})(Consignor);
