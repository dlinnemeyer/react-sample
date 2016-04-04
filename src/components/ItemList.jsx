import React from 'react';
import {displayName,linkPath} from '../models/item';
import {Link} from 'react-router';

export default React.createClass({
  render: function() {
    console.log(this.props.items);
    return <div>
      {this.props.items.toList().map(item =>
        <div className="item" key={item.get("id")}>
          <h3><Link to={linkPath(item)}>{displayName(item)}</Link></h3>
          <p>${item.get("price")}</p>
        </div>
      )}
    </div>;
  }
});
