import type { SaleItem } from '../data/items'
import { useCart } from '../context/CartContext'

type ItemCardProps = {
  item: SaleItem
}

export function ItemCard({ item }: ItemCardProps) {
  const { img_url, nombre, rareza, expansion, cantidad } = item
  const precio = (item.total ?? item.precio ?? '').trim()
  const { addItem } = useCart()
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm relative">
      {cantidad != null && cantidad !== '' && (
        <span
          className="absolute top-1.5 right-1.5 z-10 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white shadow"
          title="Cantidad"
        >
          {cantidad}
        </span>
      )}
      <div className="w-full bg-slate-100" style={{ aspectRatio: '102/149' }}>
        {img_url ? (
          <a
            href={img_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <img
              src={img_url}
              alt={nombre}
              className="w-full h-full object-cover object-center cursor-pointer"
              style={{ aspectRatio: '102/149' }}
            />
          </a>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">
          {nombre}
          {rareza ? ` - ${rareza}` : ''}
        </h3>
        <p className="text-slate-700 font-medium">{precio || '—'}</p>
        {expansion && (
          <p className="text-xs text-slate-500 truncate" title={expansion}>
            {expansion}
          </p>
        )}
        <button
          type="button"
          onClick={() => addItem(item)}
          className="mt-auto w-full py-2 px-3 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}
