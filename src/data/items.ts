export interface SaleItem {
  nombre: string
  rareza: string
  cantidad: string
  precio: string
  expansion?: string
  cotizacion?: string
  'precio usd'?: string
  total?: string
}

import itemsJson from '../../resources/15_03_2026_db.json'

export const items: SaleItem[] = itemsJson as SaleItem[]
