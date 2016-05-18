import React, {PropTypes} from 'react'
import {linkPath, propType as itemPropType} from '../models/item'
import {Link} from 'react-router'
import {toString} from 'lodash'

const fields = ["sku", "title", "brand", "color", "size", "description", "percSplit",
  "price", "printed"]

const FieldHeading = React.createClass({
  propTypes: {
    sort: PropTypes.func,
    field: PropTypes.string.isRequired,
    sorted: PropTypes.bool.isRequired
  },

  sort(){
    if(!this.props.sort) return
    return this.props.sort(this.props.field)
  },

  render(){
    const field = this.props.sorted
      ? `${this.props.field} \\/`
      : this.props.field
    return <th style={{textAlign: "left"}}>
      <span style={{cursor: "pointer"}} onClick={this.sort}>{field}</span>
    </th>
  }
})

function ItemList({items, sort, currentSort}){
  return <table>
    <thead>
      <tr>
        {fields.map(field => {
          return <FieldHeading key={field} field={field} sort={sort} sorted={field == currentSort} />
        })}
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
ItemList.propTypes = {
  sort: PropTypes.func,
  items: PropTypes.objectOf(itemPropType).isRequired,
  currentSort: PropTypes.string.isRequired
}

export default ItemList
