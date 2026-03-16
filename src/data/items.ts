export interface SaleItem {
  nombre: string
  rareza: string
  cantidad: string
  precio: string
  img_url?: string
  expansion?: string
  cotizacion?: string
  'precio usd'?: string
  total?: string
  type?: string
  race?: string
  level?: string
  atk?: string
  def?: string
  attribute?: string
  archetype?: string
}

export type Filters = {
  type: string
  race: string
  level: string
  atk: string
  def: string
  attribute: string
  archetype: string
  rarity: string
}

import itemsJson from '../../resources/db.json'

function parsePrecio(p: string): number {
  return parseFloat((p || '').replace(/[$,]/g, '')) || 0
}

const rawItems = itemsJson as SaleItem[]
export const items: SaleItem[] = [...rawItems].sort(
  (a, b) => parsePrecio(b.precio) - parsePrecio(a.precio)
)
