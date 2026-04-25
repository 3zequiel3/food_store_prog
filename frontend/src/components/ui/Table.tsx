import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  emptyMessage?: string;
  // Pagination
  manualPagination?: boolean;
  rowCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageSizeOptions?: number[];
  // Sorting
  manualSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

const DEFAULT_PAGE_SIZES = [5, 10, 20, 50];

export function DataTable<T>({
  columns,
  data,
  emptyMessage = "No hay datos para mostrar",
  manualPagination = false,
  rowCount,
  pagination,
  onPaginationChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  manualSorting = false,
  sorting,
  onSortingChange,
}: DataTableProps<T>) {
  "use no memo";

  const paginationEnabled = pagination !== undefined;
  const sortingEnabled = sorting !== undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Pagination config
    manualPagination,
    rowCount: manualPagination ? rowCount : undefined,
    onPaginationChange,
    getPaginationRowModel:
      paginationEnabled && !manualPagination
        ? getPaginationRowModel()
        : undefined,
    // Sorting config
    manualSorting,
    onSortingChange,
    getSortedRowModel:
      sortingEnabled && !manualSorting ? getSortedRowModel() : undefined,
    state: {
      ...(pagination ? { pagination } : {}),
      ...(sorting ? { sorting } : {}),
    },
  });

  const showPaginationControls = paginationEnabled;
  const pageCount = table.getPageCount();
  const currentPageIndex = pagination?.pageIndex ?? 0;
  const currentPageSize = pagination?.pageSize ?? 0;

  return (
    <div className="space-y-3">
      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-card)]">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[var(--color-primary-50)]/60"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={`
                        px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
                        text-[var(--color-primary-700)]
                        ${canSort ? "cursor-pointer select-none" : ""}
                      `}
                      style={
                        header.column.getSize() !== 150
                          ? { width: header.column.getSize() }
                          : undefined
                      }
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canSort && (
                            <span className="text-[var(--color-primary-600)]">
                              {sortDir === "asc"
                                ? "↑"
                                : sortDir === "desc"
                                  ? "↓"
                                  : "↕"}
                            </span>
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-[var(--color-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[var(--color-primary-50)]/40 transition-colors duration-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPaginationControls && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <span>Filas por página:</span>
            <select
              value={currentPageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {manualPagination && typeof rowCount === "number" && (
              <span className="ml-2">
                {rowCount === 0
                  ? "0 resultados"
                  : `${currentPageIndex * currentPageSize + 1}–${Math.min(
                      (currentPageIndex + 1) * currentPageSize,
                      rowCount,
                    )} de ${rowCount}`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-[var(--color-foreground)] hover:bg-[var(--color-primary-50)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="text-[var(--color-muted)] px-2">
              Página{" "}
              <span className="font-medium text-[var(--color-foreground)]">
                {pageCount === 0 ? 0 : currentPageIndex + 1}
              </span>{" "}
              de{" "}
              <span className="font-medium text-[var(--color-foreground)]">
                {pageCount}
              </span>
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-[var(--color-foreground)] hover:bg-[var(--color-primary-50)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
