import { useState } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";

export interface TableQueryParams {
  skip: number;
  limit: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export function useTableFilters(initialPageSize = 10) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const toQueryParams = (): TableQueryParams => {
    const first = sorting[0];
    return {
      skip: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      sort_by: first?.id,
      order: first ? (first.desc ? "desc" : "asc") : undefined,
    };
  };

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    toQueryParams,
  };
}
