import { useCart } from '../context/CartContext'

export function Navbar() {
  const { toggleCart, itemCount } = useCart()
  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">mz-ygo-sales</h1>
        <button
          type="button"
          onClick={toggleCart}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          aria-label={`Carrito${itemCount > 0 ? `, ${itemCount} productos` : ''}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm font-medium">Carrito</span>
          {itemCount > 0 && (
            <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-white text-slate-800 text-xs font-semibold">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
