import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/consignor';
import AddConsignorForm from './AddConsignorForm'

export const AddConsignor = React.createClass({
  mixins: [PureRenderMixin],

  onSubmit(data){
    console.log(data);
  },

  render: function() {
    return <div>
      <AddConsignorForm onSubmit={this.onSubmit} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
  }
}

export const AddConsignorContainer = connect(mapStateToProps)(AddConsignor);
