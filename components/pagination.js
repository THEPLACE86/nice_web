import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const firstPage = () => {
        onPageChange(1);
    };

    const lastPage = () => {
        onPageChange(totalPages);
    };

    const displayPages = () => {
        const pages = [];

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`btn ${currentPage === i ? 'btn-primary' : ''}`}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center my-4">
            <button onClick={firstPage} className="btn">
                처음
            </button>
            {displayPages()}
            <button onClick={lastPage} className="btn">
                끝
            </button>
        </div>
    );
};

export default Pagination;
