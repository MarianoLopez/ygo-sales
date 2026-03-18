import { useEffect, useState } from 'react'
import { useCart, cartLineKey, getMaxQuantity, parsePrecio } from '../context/CartContext'
import { buildWhatsAppUrl } from '../utils/whatsapp'

const COUNTRY_STORAGE_KEY = 'ygo-sales-country'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === ''
}

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, removeLine, subtotal } = useCart()
  const [countryCode, setCountryCode] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    if (isLocalHost()) return 'AR'
    return sessionStorage.getItem(COUNTRY_STORAGE_KEY)
  })

  useEffect(() => {
    if (countryCode !== null) return
    if (typeof window !== 'undefined' && isLocalHost()) {
      setCountryCode('AR')
      return
    }
    fetch('https://ip-api.com/json/?fields=countryCode')
      .then((r) => {
        if (!r.ok) return { countryCode: 'AR' }
        return r.json()
      })
      .then((data: { countryCode?: string }) => {
        const code = data.countryCode ?? 'AR'
        setCountryCode(code)
        try {
          sessionStorage.setItem(COUNTRY_STORAGE_KEY, code)
        } catch {
          // ignore
        }
      })
      .catch(() => {
        setCountryCode('AR')
      })
  }, [countryCode])

  const isArgentina = countryCode === 'AR'
  const countryUnknown = countryCode === null

  const handleConsultar = () => {
    if (!isArgentina || lines.length === 0) return
    const url = buildWhatsAppUrl(lines)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        aria-hidden="true"
        onClick={closeCart}
      />
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Carrito de compras</h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 text-slate-500 hover:text-slate-700 rounded"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay productos en el carrito.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600 font-medium">
                  <th className="pb-2 pr-2">PRODUCTO</th>
                  <th className="pb-2 text-right">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const key = cartLineKey(line)
                  const unitPrice = parsePrecio(line.item.total ?? line.item.precio ?? '')
                  const lineSubtotal = unitPrice * line.quantity
                  const maxQty = getMaxQuantity(line.item)
                  const label = [line.item.nombre, line.item.rareza].filter(Boolean).join(' - ')
                  return (
                    <tr key={key} className="border-b border-slate-100 align-top">
                      <td className="py-3 pr-2">
                        <div className="flex gap-3">
                          <div className="w-14 h-14 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                            {line.item.img_url ? (
                              <img
                                src={line.item.img_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                Sin img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 line-clamp-2">{label}</p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {formatMoney(unitPrice)} c/u
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <button
                                type="button"
                                onClick={() => setQuantity(key, line.quantity - 1)}
                                disabled={line.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Menos"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-medium tabular-nums">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQuantity(key, line.quantity + 1)}
                                disabled={line.quantity >= maxQty}
                                className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Más"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right align-top">
                        <div className="flex items-start justify-end gap-2">
                          <span className="font-semibold text-slate-800">
                            {formatMoney(lineSubtotal)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLine(key)}
                            className="p-1 text-slate-400 hover:text-red-600"
                            aria-label="Quitar del carrito"
                            title="Quitar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        {lines.length > 0 && (
          <div className="p-4 border-t border-slate-200 space-y-4">
            <p className="text-lg font-bold text-slate-800">
              Subtotal: {formatMoney(subtotal)}
            </p>
            <button
              type="button"
              onClick={handleConsultar}
              disabled={!isArgentina || countryUnknown}
              title={
                !isArgentina && !countryUnknown
                  ? 'Solo disponible para visitantes de Argentina'
                  : undefined
              }
              className="w-full py-3 px-4 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Consultar
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
