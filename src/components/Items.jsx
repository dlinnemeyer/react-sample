import React from 'react';
import {connect} from 'react-redux';
import ItemList from './ItemList';
import {loadItems, addFakeItems, deleteAllItems} from '../actions/items.js';
import {loading} from '../actions/general.js';
import {Link} from 'react-router';
import InnerLoading from './InnerLoading'

const loadingId = "itemslist";

export const Items = React.createClass({

  componentWillMount(){
    this.props.loading(loadingId, true);
    this.props.loadItems()
      .then(items=> {
        this.props.loading(loadingId, false);
      });
  },

  render() {
    const {isLoading, items, addFakeItems, deleteAllItems} = this.props;
    const _addFakeItems = e => { e.preventDefault(); addFakeItems(); }
    const _deleteAllItems = e => { e.preventDefault(); deleteAllItems(); }
    return <div>
      <Link to="/items/new">Add Item</Link><br />
      <a href="#" onClick={_addFakeItems}>Add Lots O' Items</a><br />
      <a href="#" onClick={_deleteAllItems}>Delete All</a>
      {isLoading
        ? <InnerLoading />
        : <ItemList items={items} />}
    </div>;
  }

});

function mapStateToProps(state){
  return {
    // pull from state just pulls all items, which is obviously bad. we need to instead store
    // some page-related state for this Items page, including pagination, filters, and current
    // displayed itemids.
    // We can then load just those itemids into the state's item model repo, then pull the details
    // from there.
    // Remember, there's a big difference between async data pulls (loadItems, which populates
    // the state's model repo) and grabbing data from state (getItems, which pulls from the state's
    // model repo). I wonder if there's a way to blend the two so component wrappers
    // don't have to care about the difference? though probably not. component wrappers probably
    // need to know their own state structure, which means they have to know they're only storring
    // id's in their state, not full objects. which means they have to know the difference between
    // hydrating a model repo and pulling from the repo based on id
    items: state.items,
    isLoading: state.loading[loadingId]
  }
}

export const ItemsContainer = connect(mapStateToProps, {
  loadItems, loading, addFakeItems, deleteAllItems
})(Items);
