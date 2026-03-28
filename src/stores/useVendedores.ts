import { ref } from 'vue'

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

    const res = await fetch(`${API}/vendedores`, { method: 'POST', body: form })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }

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
    } else if (vendedor.avatar_url) {
      form.append('avatar_url', vendedor.avatar_url)
    }

    const res = await fetch(`${API}/vendedores/${id}`, { method: 'PUT', body: form })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }

    const index = vendedorList.value.findIndex(v => v.id === id)
    if (index !== -1) {
      vendedorList.value[index] = { id, ...vendedor }
    }
  }

  const deleteVendedor = async (id: string) => {
    const res = await fetch(`${API}/vendedores/${id}`, { method: 'DELETE' })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
    vendedorList.value = vendedorList.value.filter(v => v.id !== id)
  }

  return { vendedorList, loading, fetchVendedores, addVendedor, updateVendedor, deleteVendedor }
}
