import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (data: { selected: number }) => {
    // React-Paginate використовує 0-індексацію, ми перетворюємо на 1-індексацію
    onPageChange(data.selected + 1);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={css.paginationContainer}>
      {' '}
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        pageClassName={css['pageItem']}
        pageLinkClassName={css['pageLink']}
        previousClassName={css['pageItem']}
        previousLinkClassName={css['pageLink']}
        nextClassName={css['pageItem']}
        nextLinkClassName={css['pageLink']}
        breakClassName={css['pageItem']}
        breakLinkClassName={css['pageLink']}
        activeClassName={css.active}
        // Потрібно для бібліотеки
        renderOnZeroPageCount={null}
      />{' '}
    </nav>
  );
};

export default Pagination;
