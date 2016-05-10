import React, {PropTypes} from 'react'
import {range} from 'lodash/fp'

const Pagination = React.createClass({
  paginate(event, page){
    event.preventDefault()
    this.props.onPage(page)
  },

  render(){
    const { pages, page, total } = this.props
    return <div className="pagination">
      <span className="totalCount">Total: {total}</span>{" "}
      {range(1, pages + 1).map((i) => {
        return i == page
          ? <span style={{fontWeight: "bold"}} key={i}>{i}</span>
          : (<a href="#" onClick={e => this.paginate(e, i)} key={i}>
              {i}
            </a>)
      })}
    </div>
  }
})

Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
}

export default Pagination
