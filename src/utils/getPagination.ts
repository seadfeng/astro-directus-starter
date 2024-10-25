 import getPageNumbers from "./getPageNumbers";

interface GetPaginationProps {
  totalCount: number;
  page: string | number;
  isIndex?: boolean;
}

const getPagination = ({
  totalCount,
  page,
  isIndex = false,
}: GetPaginationProps) => {
  const totalPagesArray = getPageNumbers(totalCount);
  const totalPages = totalPagesArray.length;

  const currentPage = isIndex
    ? 1
    : page && !isNaN(Number(page)) && totalPagesArray.includes(Number(page))
      ? Number(page)
      : 0; 

  return {
    totalPages,
    currentPage
  };
};

export default getPagination;
