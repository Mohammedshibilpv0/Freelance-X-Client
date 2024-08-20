import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };


  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-700 dark:text-gray-400">
      </span>

      <div className="inline-flex mt-2 xs:mt-0">
        <button
          onClick={handlePrevious}
          className={`flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-slate-800 rounded-s hover:bg-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <p className='flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-slate-800 border-0 border-s border-slate-700  hover:bg-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'>{currentPage}</p>
        <button
          onClick={handleNext}
          className={`flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-slate-800 border-0 border-s border-slate-700 rounded-e hover:bg-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
