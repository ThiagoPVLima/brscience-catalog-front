import { ref } from 'vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface ProductLine {
  name: string
  color: string
  imageUrl?: string
}

const productLines = ref<ProductLine[]>([])
const loading = ref(false)

export function useProductLines() {

  const fetchLines = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API}/product-lines`)
      const data = await res.json()
      productLines.value = (data || []).map((row: any) => ({
        name: row.name,
        color: row.color,
        imageUrl: row.image_url || undefined
      }))
    } catch (err) {
      console.error('Erro ao buscar linhas:', err)
    } finally {
      loading.value = false
    }
  }

  const addLine = async (line: ProductLine, imageFile?: File) => {
    const form = new FormData()
    form.append('name', line.name)
    form.append('color', line.color)
    if (imageFile) form.append('image', imageFile)
    else if (line.imageUrl) form.append('image_url', line.imageUrl)

    const res = await fetch(`${API}/product-lines`, { method: 'POST', body: form })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }

    productLines.value.push(line)
  }

  const updateLine = async (oldName: string, newLine: ProductLine, imageFile?: File) => {
    const form = new FormData()
    form.append('name', newLine.name)
    form.append('color', newLine.color)
    if (imageFile) form.append('image', imageFile)
    else if (newLine.imageUrl) form.append('image_url', newLine.imageUrl)

    const res = await fetch(`${API}/product-lines/${encodeURIComponent(oldName)}`, {
      method: 'PUT',
      body: form
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }

    const index = productLines.value.findIndex(l => l.name === oldName)
    if (index !== -1) productLines.value[index] = newLine
  }

  const deleteLine = async (name: string) => {
    const res = await fetch(`${API}/product-lines/${encodeURIComponent(name)}`, { method: 'DELETE' })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
    productLines.value = productLines.value.filter(l => l.name !== name)
  }

  const getLineColor = (lineName: string): string => {
    return productLines.value.find(l => l.name === lineName)?.color || '#64748b'
  }

  return { productLines, loading, fetchLines, addLine, updateLine, deleteLine, getLineColor }
}
