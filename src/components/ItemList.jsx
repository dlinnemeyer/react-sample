import React from 'react';
import {displayName,linkPath} from '../models/item';
import {Link} from 'react-router';

export default React.createClass({
  render: function() {
    let items = this.props.items;
    return <div>
      {Object.keys(items).filter(i => items[i]).map(i => {
        let item = items[i];
        return (
          <div className="item" key={item.id}>
            <h3><Link to={linkPath(item)}>{displayName(item)}</Link></h3>
            <p>${item.price}</p>
          </div>
        )
      })}
    </div>;
  }
});
