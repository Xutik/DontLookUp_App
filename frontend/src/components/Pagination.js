// Pagination Section Component
export function PaginationSection({ paginatedData, debouncedSearchQuery, handlePrevPage, handleNextPage, itemsPerPage, handleItemsPerPageChange }) {
  return (
    <nav className="pagination-section">
      <div className="pagination-controls" role="navigation" aria-label="Pagination">
        <div className="pagination-info" aria-live="polite">
          Page {paginatedData.metadata.currentPage} of {paginatedData.metadata.totalPages} ({paginatedData.metadata.totalItems} total items)
          {debouncedSearchQuery && <span> - Search: "{debouncedSearchQuery}"</span>}
        </div>

        <div className="pagination-buttons">
          <button
            onClick={handlePrevPage}
            disabled={!paginatedData.metadata.hasPrevPage}
            className="pagination-btn"
            aria-label="Go to previous page"
            aria-disabled={!paginatedData.metadata.hasPrevPage}
          >
            Previous
          </button>

          <button
            onClick={handleNextPage}
            disabled={!paginatedData.metadata.hasNextPage}
            className="pagination-btn"
            aria-label="Go to next page"
            aria-disabled={!paginatedData.metadata.hasNextPage}
          >
            Next
          </button>
        </div>

        {/* Items per page selector */}
        <div className="items-per-page">
          <label htmlFor="items-per-page-select">Items per page: </label>
          <select id="items-per-page-select" value={itemsPerPage} onChange={handleItemsPerPageChange} aria-label="Select number of items per page">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
