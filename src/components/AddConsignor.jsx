import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {displayName} from '../models/consignor';
import AddConsignorForm from './AddConsignorForm'
import {addConsignor} from '../actions/actions.js'

export const AddConsignor = React.createClass({
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
    this.props.addConsignor(data).then((consignor) => this.context.router.push('/consignors'));
  },

  isLoading(){
    return !!this.props.formLoading;
  },

  render(){
    return <div>
      <AddConsignorForm onSubmit={this.onSubmit} isLoading={this.isLoading()} />
    </div>;
  }
});

function mapStateToProps(state, props){
  return {
    formLoading: state.getIn(["loading", "addConsignor"])
  }
}

export const AddConsignorContainer = connect(
  mapStateToProps, {addConsignor}
)(AddConsignor);
