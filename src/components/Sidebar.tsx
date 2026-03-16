import { SearchBar } from './SearchBar'
import type { Filters } from '../data/items'

type FilterOptions = {
  type: string[]
  race: string[]
  level: string[]
  atk: string[]
  def: string[]
  attribute: string[]
  archetype: string[]
  rarity: string[]
}

type SidebarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  filterOptions: FilterOptions
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  id,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  id: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-800"
      >
        <option value="">Todos</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Sidebar({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  filterOptions,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6 p-4 border-r border-slate-200 bg-white">
      <SearchBar value={searchValue} onChange={onSearchChange} />
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-slate-700">Filtros</h2>
        <FilterSelect
          id="filter-type"
          label="Type"
          value={filters.type}
          options={filterOptions.type}
          onChange={(v) => onFilterChange('type', v)}
        />
        <FilterSelect
          id="filter-rarity"
          label="Rarity"
          value={filters.rarity}
          options={filterOptions.rarity}
          onChange={(v) => onFilterChange('rarity', v)}
        />
        <FilterSelect
          id="filter-race"
          label="Race"
          value={filters.race}
          options={filterOptions.race}
          onChange={(v) => onFilterChange('race', v)}
        />
        <FilterSelect
          id="filter-level"
          label="Level"
          value={filters.level}
          options={filterOptions.level}
          onChange={(v) => onFilterChange('level', v)}
        />
        <FilterSelect
          id="filter-atk"
          label="ATK"
          value={filters.atk}
          options={filterOptions.atk}
          onChange={(v) => onFilterChange('atk', v)}
        />
        <FilterSelect
          id="filter-def"
          label="DEF"
          value={filters.def}
          options={filterOptions.def}
          onChange={(v) => onFilterChange('def', v)}
        />
        <FilterSelect
          id="filter-attribute"
          label="Attribute"
          value={filters.attribute}
          options={filterOptions.attribute}
          onChange={(v) => onFilterChange('attribute', v)}
        />
        <FilterSelect
          id="filter-archetype"
          label="Archetype"
          value={filters.archetype}
          options={filterOptions.archetype}
          onChange={(v) => onFilterChange('archetype', v)}
        />
      </section>
    </aside>
  )
}
