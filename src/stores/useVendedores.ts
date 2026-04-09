import { ref } from 'vue'
import { getAuthHeaders } from '../utils/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface Vendedor {
  id: string
  nome: string
  whatsapp: string
  avatar_url?: string
}

const vendedorList = ref<Vendedor[]>([])
const loading = ref(false)

export function useVendedores() {

  const fetchVendedores = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API}/vendedores`)
      vendedorList.value = await res.json()
    } catch (err) {
      console.error('Erro ao buscar vendedores:', err)
    } finally {
      loading.value = false
    }
  }

  const addVendedor = async (vendedor: Omit<Vendedor, 'id'>, avatarFile?: File) => {
    const form = new FormData()
    form.append('nome', vendedor.nome)
    form.append('whatsapp', vendedor.whatsapp)
    if (avatarFile) {
      form.append('avatar', avatarFile)
    } else if (vendedor.avatar_url) {
      form.append('avatar_url', vendedor.avatar_url)
    }

    const res = await fetch(`${API}/vendedores`, { method: 'POST', headers: getAuthHeaders(), body: form })
    if (!res.ok) {
      let msg = 'Erro ao criar vendedor'
      try { const e = await res.json(); msg = e.error || e.message || msg } catch {}
      throw new Error(msg)
    }

    const data = await res.json()
    vendedorList.value.push(data)
    vendedorList.value.sort((a, b) => a.nome.localeCompare(b.nome))
  }

  const updateVendedor = async (id: string, vendedor: Omit<Vendedor, 'id'>, avatarFile?: File) => {
    const form = new FormData()
    form.append('nome', vendedor.nome)
    form.append('whatsapp', vendedor.whatsapp)
    if (avatarFile) {
      form.append('avatar', avatarFile)
    } else {
      form.append('avatar_url', vendedor.avatar_url || '')
    }

    const res = await fetch(`${API}/vendedores/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: form })
    if (!res.ok) {
      let msg = 'Erro ao atualizar vendedor'
      try { const e = await res.json(); msg = e.error || e.message || msg } catch {}
      throw new Error(msg)
    }

    const index = vendedorList.value.findIndex(v => v.id === id)
    if (index !== -1) {
      vendedorList.value[index] = { id, ...vendedor }
    }
  }

  const deleteVendedor = async (id: string) => {
    const res = await fetch(`${API}/vendedores/${id}`, { method: 'DELETE', headers: getAuthHeaders() })
    if (!res.ok) {
      let msg = 'Erro ao excluir vendedor'
      try { const e = await res.json(); msg = e.error || e.message || msg } catch {}
      throw new Error(msg)
    }
    vendedorList.value = vendedorList.value.filter(v => v.id !== id)
  }

  return { vendedorList, loading, fetchVendedores, addVendedor, updateVendedor, deleteVendedor }
}
