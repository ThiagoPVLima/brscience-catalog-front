import { ref } from 'vue'

export interface ProductLine {
  name: string
  color: string
}

// Linhas iniciais
const initialLines: ProductLine[] = [
  { name: 'Fusion Frizz', color: '#6b8cff' },
  { name: 'Amazon Forest', color: '#4fae7a' },
  { name: 'Sem Pausa', color: '#d6c36a' },
  { name: 'Revita Liss', color: '#c084fc' },
  { name: 'Baldes', color: '#f39200' }
]

const productLines = ref<ProductLine[]>([...initialLines])

export function useProductLines() {
  const addLine = (line: ProductLine) => {
    productLines.value.push(line)
  }

  const updateLine = (oldName: string, newLine: ProductLine) => {
    const index = productLines.value.findIndex(l => l.name === oldName)
    if (index !== -1) {
      productLines.value[index] = newLine
    }
  }

  const deleteLine = (name: string) => {
    productLines.value = productLines.value.filter(l => l.name !== name)
  }

  const getLineColor = (lineName: string): string => {
    const line = productLines.value.find(l => l.name === lineName)
    return line?.color || '#64748b'
  }

  return {
    productLines,
    addLine,
    updateLine,
    deleteLine,
    getLineColor
  }
}
