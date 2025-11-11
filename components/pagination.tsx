import { ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  onNext: () => void;
  canNext: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  canNext,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between w-full mt-4">
      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={`rounded-full px-3 py-1.5 text-xs sm:text-sm transition-all duration-150 ${
              currentPage === index
                ? "bg-[#F6F6F7] text-[#050000]"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!canNext}
        className={`flex items-center gap-2 rounded-[8px] px-4 py-2 text-[14px] font-normal text-[#050000] sm:text-sm transition-colors duration-150 ${
          canNext
            ? "bg-[#F6F6F7] hover:bg-[#e8e8ea]"
            : "bg-gray-200 cursor-not-allowed opacity-70"
        }`}
      >
        Next
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
