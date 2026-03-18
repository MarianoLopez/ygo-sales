import { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { ItemCard } from '../components/ItemCard'
import { items } from '../data/items'
import type { SaleItem, Filters } from '../data/items'

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc'

function parsePrecio(precio: string): number {
  return parseFloat((precio || '').replace(/[$,]/g, '')) || 0
}

function precioForItem(item: SaleItem): string {
  return (item.total ?? item.precio ?? '').trim()
}

function parseDate(s: string): number {
  if (!s) return 0
  const t = Date.parse(s)
  return Number.isNaN(t) ? 0 : t
}

function uniqueValues(items: SaleItem[], key: keyof SaleItem): string[] {
  const set = new Set<string>()
  for (const item of items) {
    const v = item[key]
    if (v != null && String(v).trim() !== '') set.add(String(v).trim())
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function filterAndSortItems(
  data: SaleItem[],
  searchQuery: string,
  filters: Filters,
  sortBy: SortOption
): SaleItem[] {
  const q = searchQuery.trim().toLowerCase()
  let filtered = q
    ? data.filter((item) => (item.nombre ?? '').toLowerCase().includes(q))
    : [...data]

  if (filters.type) filtered = filtered.filter((item) => (item.type ?? '') === filters.type)
  if (filters.race) filtered = filtered.filter((item) => (item.race ?? '') === filters.race)
  if (filters.level) filtered = filtered.filter((item) => (item.level ?? '') === filters.level)
  if (filters.atk) filtered = filtered.filter((item) => (item.atk ?? '') === filters.atk)
  if (filters.def) filtered = filtered.filter((item) => (item.def ?? '') === filters.def)
  if (filters.attribute) filtered = filtered.filter((item) => (item.attribute ?? '') === filters.attribute)
  if (filters.archetype) filtered = filtered.filter((item) => (item.archetype ?? '') === filters.archetype)
  if (filters.rarity) filtered = filtered.filter((item) => (item.rareza ?? '') === filters.rarity)

  if (sortBy === 'default') return filtered
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.nombre ?? '').localeCompare(b.nombre ?? '')
      case 'name-desc':
        return (b.nombre ?? '').localeCompare(a.nombre ?? '')
      case 'price-asc':
        return parsePrecio(precioForItem(a)) - parsePrecio(precioForItem(b))
      case 'price-desc':
        return parsePrecio(precioForItem(b)) - parsePrecio(precioForItem(a))
      case 'date-desc':
        return parseDate(b.tcg_player_updatedate ?? '') - parseDate(a.tcg_player_updatedate ?? '')
      case 'date-asc':
        return parseDate(a.tcg_player_updatedate ?? '') - parseDate(b.tcg_player_updatedate ?? '')
      default:
        return 0
    }
  })
  return sorted
}

const initialFilters: Filters = {
  type: '',
  race: '',
  level: '',
  atk: '',
  def: '',
  attribute: '',
  archetype: '',
  rarity: '',
}

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [sortBy, setSortBy] = useState<SortOption>('price-desc')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filterOptions = useMemo(
    () => ({
      type: uniqueValues(items, 'type'),
      race: uniqueValues(items, 'race'),
      level: uniqueValues(items, 'level'),
      atk: uniqueValues(items, 'atk'),
      def: uniqueValues(items, 'def'),
      attribute: uniqueValues(items, 'attribute'),
      archetype: uniqueValues(items, 'archetype'),
      rarity: uniqueValues(items, 'rareza'),
    }),
    []
  )

  const filteredAndSortedItems = useMemo(
    () => filterAndSortItems(items, searchQuery, filters, sortBy),
    [searchQuery, filters, sortBy]
  )

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,280px)_1fr] flex-1">
        {/* Sidebar: visible on desktop, drawer on mobile */}
        <div className="hidden lg:block">
          <Sidebar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={setFilter}
            filterOptions={filterOptions}
          />
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            aria-modal="true"
            role="dialog"
            aria-label="Filtros"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[min(280px,85vw)] bg-white shadow-xl overflow-y-auto">
              <div className="p-4 flex justify-between items-center border-b border-slate-200">
                <span className="font-semibold text-slate-800">Filtros</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-700"
                  aria-label="Cerrar filtros"
                >
                  ✕
                </button>
              </div>
              <Sidebar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={setFilter}
                filterOptions={filterOptions}
              />
            </div>
          </div>
        )}

        {/* Main: sort bar + grid */}
        <main className="min-w-0 px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white"
            >
              <span aria-hidden>☰</span> FILTRAR
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <span>Ordenar por</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-800"
              >
                <option value="default">Por defecto</option>
                <option value="name-asc">Nombre A–Z</option>
                <option value="name-desc">Nombre Z–A</option>
                <option value="price-asc">Precio menor a mayor</option>
                <option value="price-desc">Precio mayor a menor</option>
                <option value="date-desc">Fecha de subida (más reciente)</option>
                <option value="date-asc">Fecha de subida (más antigua)</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAndSortedItems.map((item, index) => (
              <ItemCard key={`${item.nombre}-${index}`} item={item} />
            ))}
          </div>
          {filteredAndSortedItems.length === 0 && (
            <p className="text-slate-500 text-center py-8">No hay ítems que coincidan.</p>
          )}
        </main>
      </div>
    </div>
  )
}
