import type { SaleItem } from '../data/items'

type ItemCardProps = {
  item: SaleItem
}

export function ItemCard({ item }: ItemCardProps) {
  const { img_url, nombre, precio, rareza, expansion } = item
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
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
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">
          {nombre}
          {rareza ? ` - ${rareza}` : ''}
        </h3>
        <p className="text-slate-700 font-medium">{precio}</p>
        {expansion && (
          <p className="text-xs text-slate-500 truncate" title={expansion}>
            {expansion}
          </p>
        )}
      </div>
    </article>
  )
}
