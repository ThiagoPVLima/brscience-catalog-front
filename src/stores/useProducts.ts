import { ref } from 'vue'
import type { Product } from '../types/products'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const productList = ref<Product[]>([])
const loading = ref(false)

export function useProducts() {

  // ─── Busca todos os produtos ────────────────────────────────────────────────
  const fetchProducts = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API}/products`)
      const data = await res.json()
      productList.value = (data || []).map(rowToProduct)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    } finally {
      loading.value = false
    }
  }

  // ─── Adiciona produto ────────────────────────────────────────────────────────
  const addProduct = async (product: Product) => {
    const form = productToFormData(product)

    const res = await fetch(`${API}/products`, { method: 'POST', body: form })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }

    const data = await res.json()

    const lastIdx = productList.value.reduce(
      (acc: number, p: Product, i: number) => p.line === product.line ? i : acc, -1
    )
    if (lastIdx === -1) {
      productList.value.push(rowToProduct(data))
    } else {
      productList.value.splice(lastIdx + 1, 0, rowToProduct(data))
    }
  }

  // ─── Atualiza produto ────────────────────────────────────────────────────────
  const updateProduct = async (updatedProduct: Product, originalCode: string) => {
    const form = productToFormData(updatedProduct)

    const res = await fetch(`${API}/products/${encodeURIComponent(originalCode)}`, {
      method: 'PUT',
      body: form
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }

    const index = productList.value.findIndex((p: Product) => p.code === originalCode)
    if (index !== -1) {
      productList.value[index] = updatedProduct
    }
  }

  // ─── Remove produto ──────────────────────────────────────────────────────────
  const deleteProduct = async (code: string) => {
    const res = await fetch(`${API}/products/${encodeURIComponent(code)}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
    productList.value = productList.value.filter((p: Product) => p.code !== code)
  }

  return { productList, loading, fetchProducts, addProduct, updateProduct, deleteProduct }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rowToProduct(row: any): Product {
  return {
    name: row.name,
    line: row.line,
    code: row.code,
    ncm: row.ncm || '',
    cest: row.cest || '',
    anvisa: row.anvisa || '',
    distributorPrice: row.distributor_price || '',
    price: row.price || '',
    image: row.image_url || '',
    imageweb: row.image_url || '',
    discountPercentage: row.discount_percentage ?? undefined,
    color: row.color || undefined,
  }
}

function productToFormData(p: Product): FormData {
  const form = new FormData()
  form.append('name', p.name)
  form.append('line', p.line)
  form.append('code', p.code)
  form.append('ncm', p.ncm)
  form.append('cest', p.cest)
  form.append('anvisa', p.anvisa)
  form.append('distributor_price', p.distributorPrice)
  form.append('price', p.price)
  form.append('discount_percentage', p.discountPercentage != null ? String(p.discountPercentage) : '')
  form.append('color', p.color || '')

  // Se for base64, manda como image_url; se for File, manda como arquivo
  const img = p.imageweb || p.image
  if (img instanceof File) {
    form.append('image', img)
  } else if (img) {
    form.append('image_url', img)
  }

  return form
}
