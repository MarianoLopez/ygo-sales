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
}

import itemsJson from '../../resources/db.json'

export const items: SaleItem[] = itemsJson as SaleItem[]
