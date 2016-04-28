import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {get as getConsignorFromState} from '../models/consignor';
import {getAll as getItemsFromState} from '../models/item';
import ConsignorDetails from './ConsignorDetails'
import ItemList from './ItemList'
import {loadConsignors} from '../actions/consignors'
import {loadItems} from '../actions/items'
import {loading, error} from '../actions/general'
import InnerLoading from './InnerLoading'
import Error from './Error'

export const Consignor = React.createClass({

  id(){
    return this.props.params.consignorid;
  },

  // This is where the current redux-react stack is kind of weird. in most cases, a component
  // simply renders a given state, and sends actions back up to our redux actions based on user
  // interactions (e.g. render a consignor list; when the user clicks on delete, issue a
  // deleteConsignor action).
  // But here we're performing redux actions (manipulating state by loading in consignor details that
  // weren't there before) based on when a component loads, not based on user behavior.
  // The counter could be that loading the component is user behavior (they're requesting the data),
  // but that feels like a stretch. It seems to make much more sense to declare the needs
  // for a component (component X needs A, B, and C from the state), and somewhere else in the tool,
  // describe how to get A,B,C, etc. from the state when components needs it? I'm guessing that's
  // where graphql and falcor are headed?
  componentWillMount(){
    // we're getting closer. this should be easy to wrap.
    // keying to different ids for now? that way we're not mixing up state in case of multiple
    // consignor components? not sure of the best practice there.
    // redux form gets away with just naming the form, but I think that's because you never
    // have the same form on the page multiple times? maybe?
    const loadingId = "consignor" + this.id();
    // we should refactor to let some itemlist wrapper component pull its own data based on filters
    const itemsLoadingId = "consignor-items" + this.id();

    this.props.loading(loadingId, true);

    this.props.loadConsignors([this.id()])
      .then(consignors => {
        this.props.loading(loadingId, false);
        const consignor = consignors ? consignors[this.id()] : undefined;
        if(!consignor){
          this.props.error(loadingId, "That's not a valid consignor.");
          return;
        }

        // now make sure the items get loaded, too
        this.props.loading(itemsLoadingId, true);
        return this.props.loadItems(consignor.items);
      })
      // magic promise chain. then next then will run when getItems() is finished
      .then(items => {
        this.props.loading(itemsLoadingId, false);
      });
  },

  render: function() {
    const { consignorLoading, itemsLoading, consignor, items, errorMessage } = this.props;

    if(errorMessage) return <Error message={errorMessage} />;

    // early return because we have nested ifs with the loading. again, this is solved if we
    // get a separate itemslist component that does its own loading
    if(consignorLoading) return <InnerLoading />;

    return <div>
      <ConsignorDetails consignor={consignor} />
      {itemsLoading
        ? <InnerLoading />
        : <ItemList items={items} />}
    </div>;
  }
});

Consignor.propTypes = {
  consignorLoading: PropTypes.bool.isRequired,
  itemsLoading: PropTypes.bool.isRequired,
  consignor: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  errorMessage: PropTypes.string.isRequired
}

function mapStateToProps(state, props){
  const id = props.params.consignorid;
  const consignor = getConsignorFromState(state, id) || {};
  // this items part will have to go through some re-working if we make it filterable. probably
  // an itemlist component that takes filters instead of itemids and retrieves its own itemids?
  const items = getItemsFromState(state, consignor.items ? consignor.items : []);

  return {
    consignorLoading: !!(state.loading["consignor" + id]),
    itemsLoading: !!(state.loading["consignor-items" + id]),
    errorMessage: state.error["consignor"+id] || "",
    consignor,
    items
  }
}

export const ConsignorContainer = connect(mapStateToProps, {
  loadConsignors, loadItems, loading, error
})(Consignor);
