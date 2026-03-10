import { ref } from 'vue'
import { supabase, uploadImage } from '../lib/supabase'
import type { Product } from '../types/products'

const productList = ref<Product[]>([])
const loading = ref(false)

export function useProducts() {

  // ─── Busca todos os produtos do banco ───────────────────────────────────────
  const fetchProducts = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('line')
      .order('sort_order')

    if (error) {
      console.error('Erro ao buscar produtos:', error.message)
    } else {
      productList.value = (data || []).map(rowToProduct)
    }
    loading.value = false
  }

  // ─── Adiciona produto ────────────────────────────────────────────────────────
  const addProduct = async (product: Product) => {
    let imageUrl = product.imageweb
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = await uploadImage(imageUrl, 'products')
    }

    const row = productToRow({ ...product, imageweb: imageUrl, image: imageUrl })

    const lastOfLine = productList.value.filter(p => p.line === product.line)
    const sortOrder = lastOfLine.length > 0
      ? Math.max(...lastOfLine.map((_, i) => i)) + 1
      : productList.value.length

    const { data, error } = await supabase
      .from('products')
      .insert({ ...row, sort_order: sortOrder })
      .select()
      .single()

    if (error) throw new Error(error.message)

    const lastIdx = productList.value.reduce((acc: number, p: Product, i: number) => p.line === product.line ? i : acc, -1)
    if (lastIdx === -1) {
      productList.value.push(rowToProduct(data))
    } else {
      productList.value.splice(lastIdx + 1, 0, rowToProduct(data))
    }
  }

  // ─── Atualiza produto ────────────────────────────────────────────────────────
  const updateProduct = async (updatedProduct: Product, originalCode: string) => {
    let imageUrl = updatedProduct.imageweb
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = await uploadImage(imageUrl, 'products')
    }

    const row = productToRow({ ...updatedProduct, imageweb: imageUrl, image: imageUrl })

    const { error } = await supabase
      .from('products')
      .update(row)
      .eq('code', originalCode)

    if (error) throw new Error(error.message)

    const index = productList.value.findIndex((p: Product) => p.code === originalCode)
    if (index !== -1) {
      productList.value[index] = { ...updatedProduct, imageweb: imageUrl, image: imageUrl }
    }
  }

  // ─── Remove produto ──────────────────────────────────────────────────────────
  const deleteProduct = async (code: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('code', code)

    if (error) throw new Error(error.message)

    productList.value = productList.value.filter((p: Product) => p.code !== code)
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

function productToRow(p: Product) {
  return {
    name: p.name,
    line: p.line,
    code: p.code,
    ncm: p.ncm,
    cest: p.cest,
    anvisa: p.anvisa,
    distributor_price: p.distributorPrice,
    price: p.price,
    image_url: p.imageweb || p.image || '',
    discount_percentage: p.discountPercentage ?? null,
    color: p.color ?? null,
  }
}
