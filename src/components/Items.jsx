import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import ItemList from './ItemList'
import {Link} from 'react-router';

export const Items = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div>
      <Link to="/items/new">Add Item</Link>
      <ItemList items ={this.props.items} />
    </div>
  }
});

function mapStateToProps(state){
  return {
    items: state.get('items')
  }
}

export const ItemsContainer = connect(mapStateToProps)(Items);
