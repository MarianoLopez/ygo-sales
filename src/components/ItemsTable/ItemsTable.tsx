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

function parsePrecio(precio: string): number {
  return parseFloat((precio || '').replace(/[$,]/g, '')) || 0
}

const columns = [
  columnHelper.accessor('img_url', {
    header: '',
    enableSorting: false,
    cell: (info) => {
      const url = info.getValue()
      const nombre = info.row.original.nombre ?? ''
      if (!url) return <span className="text-slate-500 text-sm">—</span>
      return (
        <img
          src={url}
          alt={nombre}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded object-cover bg-slate-700"
        />
      )
    },
  }),
  columnHelper.accessor('nombre', {
    header: 'Nombre',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cantidad', {
    header: 'Cantidad',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => parsePrecio(row.precio), {
    id: 'precio',
    header: 'Precio',
    cell: (info) => info.row.original.precio,
    sortingFn: 'basic',
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
      <div className="overflow-x-auto rounded-lg border border-slate-600">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-slate-200 whitespace-nowrap first:w-24 first:sm:w-32"
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
          <tbody className="bg-slate-800 divide-y divide-slate-600">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-700/50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-slate-100 align-middle first:w-24 first:sm:w-32 first:py-2"
                  >
                    {cell.column.id === 'nombre' ? (
                      <span className="font-semibold text-white">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
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
