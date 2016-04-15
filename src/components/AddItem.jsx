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
    this.props.addItem(data).then((item) => this.context.router.push('/items'));
  },

  isLoading(){
    return !!this.props.formLoading;
  },

  render: function() {
    return <div>
      <AddItemForm onSubmit={this.onSubmit} consignors={this.props.consignors}
        isLoading={this.isLoading()} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
    // we'll need to request all the consignors for this? or probably ideally an autocomplete?
    consignors: state.get("consignors"),
    formLoading: state.getIn(["loading", "addItem"])
  }
}

export const AddItemContainer = connect(
  mapStateToProps, {
    addItem,
    loading
  }
)(AddItem);
