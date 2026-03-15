import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import type { SaleItem } from '../../data/items'

const columnHelper = createColumnHelper<SaleItem>()

const columns = [
  columnHelper.accessor('nombre', {
    header: 'Nombre',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('rareza', {
    header: 'Rareza',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cantidad', {
    header: 'Cantidad',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('precio', {
    header: 'Precio',
    cell: (info) => info.getValue(),
  }),
]

type ItemsTableProps = {
  data: SaleItem[]
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

export function ItemsTable({ data, globalFilter, onGlobalFilterChange }: ItemsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const name = row.original.nombre ?? ''
      return name.toLowerCase().includes(String(filterValue).toLowerCase())
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-slate-700 whitespace-nowrap"
                  >
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none flex items-center gap-1'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Primera
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
          <button
            type="button"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Última
          </button>
        </div>
      </div>
    </div>
  )
}
