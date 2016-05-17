import React, {PropTypes} from 'react'
import {linkPath} from '../models/item'
import {Link} from 'react-router'
import {toString} from 'lodash'

const fields = ["sku", "title", "brand", "color", "size", "description", "percSplit",
  "price", "printed"]

const FieldHeading = React.createClass({
  sort(){
    if(!this.props.sort) return

    return this.props.sort(this.props.field)
  },

  render(){
    return <th style={{textAlign: "left"}}>
      <span style={{cursor: "pointer"}} onClick={this.sort}>{this.props.field}</span>
    </th>
  }
})

const ItemList = React.createClass({
  render: function() {
    const {items, sort} = this.props
    return <table>
    <thead>
      <tr>
        {fields.map(field => <FieldHeading key={field} field={field} sort={this.props.sort} />)}
      </tr>
    </thead>
    <tbody>
      {Object.keys(items).filter(i => items[i]).map(i => {
        const item = items[i]
        return (
          <tr key={item.id}>
            {fields.map(f => {
              return f == "sku"
                ? <td key="sku"><Link to={linkPath(item)}>{item['sku']}</Link></td>
                : <td key={f}>{toString(item[f])}</td>
            })}
          </tr>
        )
      })}
    </tbody>
    </table>
  }
})

ItemList.propTypes = {
  sort: PropTypes.func
}

export default ItemList
