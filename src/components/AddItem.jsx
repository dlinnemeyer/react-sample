import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/item';
import AddItemForm from './AddItemForm'
import {loading, addItem} from '../actions/actions.js'

export const AddItem = React.createClass({
  mixins: [PureRenderMixin],
  contextTypes: {
    // this is a stupid way to make sure this.context.router is included.
    // we probably should just explicitly pass the prop in from index, or maybe use the
    // BrowserHistory singleton? or better yet, react-router-redux has an action-based way of
    // navigating
    router: React.PropTypes.object.isRequired
  },
  onSubmit(data){
    // when we async-ify this, we'll want to navigate after the action propogates
    this.props.addItem(data);
    this.context.router.push('/items');
  },

  render: function() {
    return <div>
      <AddItemForm onSubmit={this.onSubmit} {...this.props} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
    // we'll need to request all the consignors for this? or probably ideally an autocomplete?
    consignors: state.get("consignors")
  }
}

export const AddItemContainer = connect(
  mapStateToProps, {
    addItem,
    loading
  }
)(AddItem);
