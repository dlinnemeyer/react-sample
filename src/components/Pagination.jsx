import React, {PropTypes} from 'react'
import {range} from 'lodash'

const PageNumber = React.createClass({
  propTypes: {
    page: PropTypes.number.isRequired,
    current: PropTypes.bool.isRequired,
    onPage: PropTypes.func.isRequired
  },
  paginate(evt){
    evt.preventDefault()
    this.props.onPage(this.props.page)
  },

  render(){
    const { page, current } = this.props
    return current
      ? <span style={{fontWeight: "bold"}}>{page}</span>
      : <a href="#" onClick={this.paginate}>{page}</a>
  }
})


export default function Pagination({pages, page, total, onPage}){
  return <div className="pagination">
    <span className="totalCount">Total: {total}</span>{" "}
    {range(1, pages + 1).map(i => {
      return <PageNumber page={i} current={i == page} onPage={onPage} key={i} />
    })}
  </div>
}
Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
}
