type DetailMap = Record<string, unknown>

function toRecord(value: unknown): DetailMap | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null
  }
  return value as DetailMap
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function titleize(field: string): string {
  const map: Record<string, string> = {
    name: 'Nome',
    category: 'Categoria',
    color: 'Cor',
    price: 'Preço',
    measurement: 'Medida',
    size: 'Tamanho',
    description: 'Descrição',
    quantity: 'Quantidade',
  }

  return map[field] || field
}

export function formatHistoryAction(action: string): string {
  const map: Record<string, string> = {
    PRODUCT_CREATED: 'Produto criado',
    PRODUCT_UPDATED: 'Produto atualizado',
    PRODUCT_DELETED: 'Produto removido',
    PRODUCT_ACTIVATED: 'Produto ativado',
    PRODUCT_DEACTIVATED: 'Produto inativado',
    QUANTITY_ADDED: 'Quantidade adicionada',
    QUANTITY_REMOVED: 'Quantidade removida',
  }

  return map[action] || action
}

export function formatHistoryDetails(action: string, details?: Record<string, unknown>): string[] {
  const data = toRecord(details)
  if (!data) return []

  if (action === 'PRODUCT_CREATED') {
    const name = asString(data.name)
    const category = asString(data.category)
    const quantity = asNumber(data.quantity)

    const lines = [
      name ? `Nome: ${name}` : null,
      category ? `Categoria: ${category}` : null,
      quantity !== null ? `Quantidade inicial: ${quantity}` : null,
    ].filter(Boolean) as string[]

    return lines
  }

  if (action === 'PRODUCT_DELETED') {
    const name = asString(data.name)
    return name ? [`Produto: ${name}`] : []
  }

  if (action === 'QUANTITY_ADDED' || action === 'QUANTITY_REMOVED') {
    const amount = asNumber(data.amount)
    const previous = asNumber(data.previous)
    const next = asNumber(data.new)
    const reason = asString(data.reason)

    const lines = [
      amount !== null ? `Ajuste: ${amount > 0 ? `+${amount}` : amount}` : null,
      previous !== null && next !== null ? `Estoque: ${previous} -> ${next}` : null,
      reason ? `Motivo: ${reason}` : 'Motivo: não informado',
    ].filter(Boolean) as string[]

    return lines
  }

  if (action === 'PRODUCT_ACTIVATED' || action === 'PRODUCT_DEACTIVATED') {
    const name = asString(data.name)
    return name ? [`Produto: ${name}`] : []
  }

  if (action === 'PRODUCT_UPDATED') {
    const lines: string[] = []

    Object.entries(data).forEach(([field, value]) => {
      const change = toRecord(value)
      const oldValue = change?.old
      const newValue = change?.new

      if (change && (oldValue !== undefined || newValue !== undefined)) {
        const oldText = oldValue === undefined || oldValue === null ? '-' : String(oldValue)
        const newText = newValue === undefined || newValue === null ? '-' : String(newValue)
        lines.push(`${titleize(field)}: ${oldText} -> ${newText}`)
      }
    })

    return lines
  }

  return []
}