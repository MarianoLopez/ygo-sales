/**
 * Phone number is stored encoded (XOR with key) so it does not appear in plain text in source/indexed content.
 * Decode at runtime when building the WhatsApp URL.
 */
const PHONE_KEY = 'ArG3nt1n@'
const ENCODED_PHONE = [116, 70, 116, 4, 87, 64, 0, 90, 118, 120, 66, 115]

function decodePhone(): string {
  return ENCODED_PHONE.map((n, i) =>
    String.fromCharCode(n ^ PHONE_KEY.charCodeAt(i % PHONE_KEY.length))
  ).join('')
}

export type CartLineForMessage = { item: { nombre: string; rareza?: string; total?: string; precio?: string }; quantity: number }

function parsePrecio(p: string): number {
  return parseFloat((p || '').replace(/[$,]/g, '')) || 0
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * Builds the WhatsApp wa.me URL with pre-filled message listing the cart items.
 * Phone is decoded from encoded constant (no plain number in code).
 */
export function buildWhatsAppUrl(lines: CartLineForMessage[]): string {
  const phone = decodePhone()
  const intro = 'Hola, estoy interesado/a en las siguientes cartas:\n\n'
  const list = lines
    .map((line) => {
      const name = [line.item.nombre, line.item.rareza].filter(Boolean).join(' - ')
      const unit = parsePrecio(line.item.total ?? line.item.precio ?? '')
      const lineTotal = unit * line.quantity
      return `• ${name} x${line.quantity} - ${formatMoney(lineTotal)}`
    })
    .join('\n')
  const message = intro + list
  const base = `https://wa.me/${phone}`
  const params = new URLSearchParams({ text: message })
  return `${base}?${params.toString()}`
}
