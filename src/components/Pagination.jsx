import React, {PropTypes} from 'react';

const Pagination = React.createClass({
  paginate(event, page){
    event.preventDefault();
    this.props.onPage(page);
  },

  render(){
    const { pages, page, total } = this.props;
    console.log(pages, page, total);
    return <div className="pagination">
      <span className="totalCount">{total}</span>{" "}
      {[...Array(pages)].map((k, i) => {
        <a href='#' onClick={e => paginate(e, i)} className={i == page ? "selected" : ""}>
          {i}
        </a>
      })}
    </div>;
  }
});

Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
}

export default Pagination;
