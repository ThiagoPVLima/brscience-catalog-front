import { ref } from 'vue'
import type { Product } from '../types/products'
import { getAuthHeaders } from '../utils/auth'

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

    const res = await fetch(`${API}/products`, { method: 'POST', headers: getAuthHeaders(), body: form })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }

    const data = await res.json()
    const newProd = rowToProduct(data)

    const lastIdx = productList.value.reduce(
      (acc: number, p: Product, i: number) => p.line === product.line ? i : acc, -1
    )
    if (lastIdx === -1) {
      productList.value.push(newProd)
    } else {
      productList.value.splice(lastIdx + 1, 0, newProd)
    }
  }

  // ─── Atualiza produto ────────────────────────────────────────────────────────
  const updateProduct = async (updatedProduct: Product, originalId: string | number) => {
    const form = productToFormData(updatedProduct)

    const res = await fetch(`${API}/products/${originalId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: form
    })
    if (!res.ok) {
      let msg = 'Erro ao atualizar produto'
      try { const err = await res.json(); msg = err.error || err.message || msg } catch {}
      throw new Error(msg)
    }

    const index = productList.value.findIndex((p: Product) => p.id === originalId)
    if (index !== -1) {
      // Mantém image_url existente se não foi enviada nova imagem
      const img = updatedProduct.imageweb || updatedProduct.image
      const keepImage = !(img instanceof File)
      productList.value[index] = {
        ...updatedProduct,
        image: keepImage ? String(img || productList.value[index].image) : productList.value[index].image,
        imageweb: keepImage ? String(img || productList.value[index].imageweb) : productList.value[index].imageweb,
      }
    }
  }

  // ─── Remove produto ──────────────────────────────────────────────────────────
  const deleteProduct = async (id: string | number) => {
    if (!id) {
      throw new Error('Este produto não possui ID e não pode ser excluído via API.')
    }

    const res = await fetch(`${API}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (!res.ok) {
      let msg = 'Erro ao deletar produto no servidor'
      try { const err = await res.json(); msg = err.error || err.message || msg } catch {}
      throw new Error(msg)
    }

    productList.value = productList.value.filter((p: Product) => p.id !== id)
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function rowToProduct(row: any): Product {
    return {
      id: row.id || row._id,
      name: row.name,
      line: row.line,
      code: row.code,
      ncm: row.ncm || '',
      cest: row.cest || '',
      anvisa: row.anvisa || '',
      distributorPrice: row.distributor_price || row.distributorPrice || '',
      price: row.price || '',
      image: row.image_url || row.image || '',
      imageweb: row.image_url || row.imageweb || '',
      discountPercentage: row.discount_percentage ?? row.discountPercentage,
      color: row.color,
    }
  }

  function productToFormData(p: Product): FormData {
    const form = new FormData()
    form.append('name', p.name)
    form.append('line', p.line)
    form.append('code', p.code)
    form.append('ncm', p.ncm || '')
    form.append('cest', p.cest || '')
    form.append('anvisa', p.anvisa || '')
    form.append('distributor_price', p.distributorPrice || '')
    form.append('price', p.price || '')
    form.append('discount_percentage', p.discountPercentage != null ? String(p.discountPercentage) : '')
    form.append('color', p.color || '')

    const img = p.imageweb || p.image
    if (img instanceof File) {
      form.append('image', img)
    } else if (img) {
      form.append('image_url', String(img))
    }
    return form
  }

  return {
    productList,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
