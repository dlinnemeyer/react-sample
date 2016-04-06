import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ItemList from './ItemList'

export const Items = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <ItemList items={this.props.items} />;
  }
});

function mapStateToProps(state){
  return {
    items: state.get('items')
  }
}

export const ItemsContainer = connect(mapStateToProps)(Items);
