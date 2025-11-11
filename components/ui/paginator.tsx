import { useMemo } from "react";
import { PaginationLink as LinkType } from "../../types";
import Link from "next/link";

interface Props {
  firstPageUrl?: string | null;
  lastPageUrl?: string | null;
  nextPageUrl?: string | null;
  prevPageUrl?: string | null;
  links: Array<LinkType>;
}

export function Paginator(props: Props) {
  const { prevPageUrl, nextPageUrl, links } = props;

  const pageLinks = useMemo(() => {
    return links.filter((item) => {
      if (item.label.toLowerCase().includes("previous")) {
        return false;
      }

      if (item.label.toLowerCase().includes("next")) {
        return false;
      }

      return true;
    });
  }, [links]);

  const displayedPageLinks = useMemo(() => {
    const activeIndex = pageLinks.findIndex((link) => link.active);
    const totalPages = pageLinks.length;
    const maxVisible = 5; // Max number of pages to show at once

    if (totalPages <= maxVisible) {
      return pageLinks;
    }

    const start = Math.max(activeIndex - 2, 0);
    const end = Math.min(activeIndex + 3, totalPages);
    const visibleLinks = pageLinks.slice(start, end);

    if (start > 1) {
      visibleLinks.unshift({ label: "...", url: undefined, active: false });
    }
    if (start > 0) {
      visibleLinks.unshift(pageLinks[0]);
    }
    if (end < totalPages - 1) {
      visibleLinks.push({ label: "...", url: undefined, active: false });
    }
    if (end < totalPages) {
      visibleLinks.push(pageLinks[totalPages - 1]);
    }

    return visibleLinks;
  }, [pageLinks]);

  return (
    <nav
      className="paginator flex items-center -space-x-px"
      aria-label="Pagination"
    >
      <Link
        as="button"
        href={prevPageUrl || "#"}
        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 border border-gray-200 px-2.5 py-2 text-sm text-gray-800 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        aria-label="Previous"
        // disabled={!prevPageUrl}
      >
        <svg
          className="size-3.5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        <span className="hidden sm:block">Previous</span>
      </Link>

      {displayedPageLinks.map((item, i) => (
        <Link
          href={item.url || "#"}
          key={i}
          as="button"
          className={`link ${item.active && "active"} ${item.url ? "" : "pointer-events-none text-gray-500"}`}
          aria-current={item.active ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}

      <Link
        as="button"
        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 border border-gray-200 px-2.5 py-2 text-sm text-gray-800 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        aria-label="Next"
        href={nextPageUrl || "#"}
        // disabled={!nextPageUrl}
      >
        <span className="hidden sm:block">Next</span>
        <svg
          className="size-3.5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </Link>
    </nav>
  );
}
