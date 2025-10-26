import { z } from "zod";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./pagination";

export function PageQueryPegination({ totalResult, currentPage, itemPerPage }) {
  const totalPage = Math.ceil(totalResult / itemPerPage);
  const peginationPages = calculatePages(currentPage, totalPage);

  return (
    <Pagination className="mt-5">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`?page=${currentPage - 1}`} />
          </PaginationItem>
        )}
        {peginationPages.map((p) => (
          <PaginationItem key={`PaginationItem-${p}`}>
            <PaginationLink href={`?page=${p}`} isActive={currentPage == p}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage + 2 < totalPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage < totalPage && (
          <PaginationItem>
            <PaginationNext href={`?page=${currentPage + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

function calculatePages(currentPage, totalPage) {
  const c = currentPage;
  const t = totalPage;
  let displayPages = [c - 2, c - 1, c, c + 1, c + 2];
  if (displayPages[0] < 1) {
    displayPages = displayPages.map((e) => e - displayPages[0] + 1);
  }
  const lp = displayPages.at(-1) || 1;
  if (lp > t) {
    displayPages = displayPages.map((e) => e - (lp - t));
  }
  displayPages = displayPages.filter((e) => e > 0);
  return displayPages;
}
export function parsePageParams(page) {
  const pageSearchParams = z.coerce.number().gte(1).safeParse(page);
  let p = 1;
  if (pageSearchParams.success) {
    p = pageSearchParams.data;
  }
  return p;
}
