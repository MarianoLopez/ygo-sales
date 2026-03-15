import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { SearchBar } from '../components/SearchBar'
import { ItemsTable } from '../components/ItemsTable/ItemsTable'
import { items } from '../data/items'

export function HomePage() {
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        <div className="space-y-4">
          <SearchBar value={globalFilter} onChange={setGlobalFilter} />
          <ItemsTable
            data={items}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />
        </div>
      </main>
    </div>
  )
}
