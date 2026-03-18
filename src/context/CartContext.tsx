import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { SaleItem } from '../data/items'

const CART_STORAGE_KEY = 'ygo-sales-cart'

export type CartLine = {
  item: SaleItem
  quantity: number
}

function cartLineKey(line: CartLine): string {
  const { item } = line
  return `${item.nombre}|${item.expansion ?? ''}|${item.rareza ?? ''}|${item.tcg_player_ref ?? item.img_url ?? ''}`
}

function getMaxQuantity(item: SaleItem): number {
  const n = parseInt(String(item.cantidad ?? '1'), 10)
  return Number.isNaN(n) || n < 1 ? 1 : n
}

function parsePrecio(p: string): number {
  return parseFloat((p || '').replace(/[$,]/g, '')) || 0
}

function loadCartFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCartToStorage(lines: CartLine[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // ignore
  }
}

type CartContextValue = {
  lines: CartLine[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: SaleItem, quantity?: number) => void
  setQuantity: (key: string, quantity: number) => void
  removeLine: (key: string) => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadCartFromStorage)
  const [isOpen, setIsOpen] = useState(false)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((o) => !o), [])

  const addItem = useCallback(
    (item: SaleItem, quantity = 1) => {
      const key = cartLineKey({ item, quantity: 0 })
      const maxQty = getMaxQuantity(item)
      setLines((prev) => {
        const idx = prev.findIndex((l) => cartLineKey(l) === key)
        let next: CartLine[]
        if (idx >= 0) {
          const line = prev[idx]
          const newQty = Math.min(maxQty, line.quantity + quantity)
          if (newQty <= 0) next = prev.filter((_, i) => i !== idx)
          else next = prev.map((l, i) => (i === idx ? { ...l, quantity: newQty } : l))
        } else {
          next = [...prev, { item, quantity: Math.min(maxQty, quantity) }]
        }
        saveCartToStorage(next)
        return next
      })
      setIsOpen(true)
    },
    []
  )

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) => {
      const next = prev.map((line) => {
        if (cartLineKey(line) !== key) return line
        const max = getMaxQuantity(line.item)
        const qty = Math.max(0, Math.min(max, quantity))
        if (qty === 0) return null
        return { ...line, quantity: qty }
      })
      const filtered = next.filter((l): l is CartLine => l != null)
      saveCartToStorage(filtered)
      return filtered
    })
  }, [])

  const removeLine = useCallback((key: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => cartLineKey(l) !== key)
      saveCartToStorage(next)
      return next
    })
  }, [])

  const itemCount = useMemo(() => lines.reduce((acc, l) => acc + l.quantity, 0), [lines])
  const subtotal = useMemo(
    () => lines.reduce((acc, l) => acc + parsePrecio(l.item.total ?? l.item.precio ?? '') * l.quantity, 0),
    [lines]
  )

  const value = useMemo(
    () => ({
      lines,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      setQuantity,
      removeLine,
      itemCount,
      subtotal,
    }),
    [lines, isOpen, openCart, closeCart, toggleCart, addItem, setQuantity, removeLine, itemCount, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export { cartLineKey, getMaxQuantity, parsePrecio }
