import React from 'react';
import {findDOMNode} from 'react-dom';
import formSerialize from '../mixins/formSerialize';
import {displayName} from '../models/consignor';

export default React.createClass({

  mixins: [formSerialize],

  fields: ["consignorid", "title", "brand", "color", "size", "description" , "percSplit",
    "price"],

  logSerialize(){
    console.log(this.serialize());
  },

  submitHandler(event){
    event.preventDefault();
    this.props.onSubmit(this.serialize());
  },

  render: function() {
    let consignors = this.props.consignors;
    return <form onSubmit={this.submitHandler} ref="form">
      <p>
        <label>Consignor</label>
        <select name="consignorid" ref="consignorid">
          {Object.keys(consignors).map(c => {
            let consignor = consignors[c];
            return (
              <option key={consignor.id} value={consignor.id}>{displayName(consignor)}</option>
            )
          })}
        </select>
      </p>
      <p>
        <input defaultValue="" placeholder="title" name="title" ref="title" />
        <input defaultValue="" placeholder="brand" name="brand" ref="brand" />
      </p>
      <p>
        <input defaultValue="" placeholder="color" name="color" ref="color" />
        <input defaultValue="" placeholder="size" name="size" ref="size" />
        <input defaultValue="" placeholder="description" name="description" ref="description" />
      </p>
      <p>
        <label>Consignor Split</label>
        <input id="percSplit" defaultValue="50" name="percSplit" ref="percSplit" />%
      </p>
      <p>
        <label>Price</label>
        $<input id="price" defaultValue="" placeholder="0.00" name="price" ref="price" />
      </p>
      <p><input type="submit" value="Add Item" /></p>
      {this.props.isLoading && <img src="/img/loading.gif" />}
    </form>;
  }
});

