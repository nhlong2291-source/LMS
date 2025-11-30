import React from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button disabled={currentPage <= 1} onClick={() => onPageChange?.(currentPage - 1)}>
        Prev
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button disabled={currentPage >= totalPages} onClick={() => onPageChange?.(currentPage + 1)}>
        Next
      </button>
    </div>
  );
}
