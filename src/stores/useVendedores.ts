import { ref } from 'vue'
import { supabase } from '../lib/supabase'

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
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .order('nome')

    if (error) {
      console.error('Erro ao buscar vendedores:', error.message)
    } else {
      vendedorList.value = data || []
    }
    loading.value = false
  }

  const addVendedor = async (vendedor: Omit<Vendedor, 'id'>, avatarFile?: File) => {
    // Insere primeiro para obter o ID gerado
    const { data, error } = await supabase
      .from('vendedores')
      .insert({
        nome: vendedor.nome,
        whatsapp: vendedor.whatsapp,
        avatar_url: vendedor.avatar_url || null
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Se tem arquivo de avatar, faz upload com o ID real
    if (avatarFile) {
      const avatarUrl = await uploadAvatar(avatarFile, data.id)
      await supabase.from('vendedores').update({ avatar_url: avatarUrl }).eq('id', data.id)
      data.avatar_url = avatarUrl
    }

    vendedorList.value.push(data)
    vendedorList.value.sort((a, b) => a.nome.localeCompare(b.nome))
  }

  const updateVendedor = async (id: string, vendedor: Omit<Vendedor, 'id'>, avatarFile?: File) => {
    let avatarUrl = vendedor.avatar_url

    if (avatarFile) {
      avatarUrl = await uploadAvatar(avatarFile, id)
    }

    const { error } = await supabase
      .from('vendedores')
      .update({
        nome: vendedor.nome,
        whatsapp: vendedor.whatsapp,
        avatar_url: avatarUrl || null
      })
      .eq('id', id)

    if (error) throw new Error(error.message)

    const index = vendedorList.value.findIndex(v => v.id === id)
    if (index !== -1) {
      vendedorList.value[index] = { id, ...vendedor, avatar_url: avatarUrl }
    }
  }

  const deleteVendedor = async (id: string) => {
    const { error } = await supabase
      .from('vendedores')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    vendedorList.value = vendedorList.value.filter(v => v.id !== id)
  }

  return {
    vendedorList,
    loading,
    fetchVendedores,
    addVendedor,
    updateVendedor,
    deleteVendedor
  }
}

// ─── Upload de avatar para o bucket 'vendedores' ─────────────────────────────
export async function uploadAvatar(file: File, vendedorId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'webp'
  const path = `${vendedorId}-${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('vendedores')
    .upload(path, file, { upsert: true, cacheControl: '3600' })

  if (error) throw new Error(`Erro no upload do avatar: ${error.message}`)

  const { data: publicData } = supabase.storage
    .from('vendedores')
    .getPublicUrl(data.path)

  return publicData.publicUrl
}
