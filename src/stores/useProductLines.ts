import { ref } from 'vue'
import { supabase } from '../lib/supabase'

// ====================================
// INTERFACE COM NOVO CAMPO imageUrl
// ====================================
export interface ProductLine {
  name: string
  color: string
  imageUrl?: string // 👈 NOVO: URL da imagem no Supabase Storage
}

const productLines = ref<ProductLine[]>([])
const loading = ref(false)

export function useProductLines() {

  // ====================================
  // BUSCAR LINHAS (atualizado)
  // ====================================
  const fetchLines = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from('product_lines')
      .select('*')
      .order('name')

    if (error) {
      console.error('Erro ao buscar linhas:', error.message)
    } else {
      productLines.value = (data || []).map((row: any) => ({
        name: row.name,
        color: row.color,
        imageUrl: row.image_url || undefined // 👈 NOVO: pega imageUrl do banco
      }))
    }
    loading.value = false
  }

  // ====================================
  // ADICIONAR LINHA (atualizado)
  // ====================================
  const addLine = async (line: ProductLine) => {
    const { error } = await supabase
      .from('product_lines')
      .insert({
        name: line.name,
        color: line.color,
        image_url: line.imageUrl || null // 👈 NOVO: salva imageUrl
      })

    if (error) throw new Error(error.message)
    productLines.value.push(line)
  }

  // ====================================
  // ATUALIZAR LINHA (atualizado)
  // ====================================
  const updateLine = async (oldName: string, newLine: ProductLine) => {
    const { error } = await supabase
      .from('product_lines')
      .update({
        name: newLine.name,
        color: newLine.color,
        image_url: newLine.imageUrl || null // 👈 NOVO: atualiza imageUrl
      })
      .eq('name', oldName)

    if (error) throw new Error(error.message)

    const index = productLines.value.findIndex(l => l.name === oldName)
    if (index !== -1) productLines.value[index] = newLine
  }

  // ====================================
  // DELETAR LINHA
  // ====================================
  const deleteLine = async (name: string) => {
    const { error } = await supabase
      .from('product_lines')
      .delete()
      .eq('name', name)

    if (error) throw new Error(error.message)
    productLines.value = productLines.value.filter(l => l.name !== name)
  }

  // ====================================
  // 🆕 UPLOAD DE IMAGEM
  // ====================================
  /**
   * Faz upload da imagem para o Supabase Storage
   * @param file - Arquivo de imagem (File object do input)
   * @param lineName - Nome da linha (usado para nomear o arquivo)
   * @returns URL pública da imagem
   */
  const uploadLineImage = async (file: File, lineName: string): Promise<string> => {
    // 1. Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${lineName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`
    const filePath = `line-images/${fileName}`

    // 2. Upload para o bucket 'product-lines'
    const { error: uploadError } = await supabase.storage
      .from('product-lines') // 👈 Nome do bucket
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // não sobrescrever se existir
      })

    if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`)

    // 3. Obter URL pública
    const { data } = supabase.storage
      .from('product-lines')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // ====================================
  // 🆕 DELETAR IMAGEM ANTIGA
  // ====================================
  /**
   * Deleta a imagem antiga do Supabase Storage
   * (usado quando o admin troca a imagem)
   */
  const deleteLineImage = async (imageUrl: string) => {
    try {
      // 1. Extrair o caminho do arquivo da URL
      const url = new URL(imageUrl)
      const pathParts = url.pathname.split('/product-lines/')
      if (pathParts.length < 2) return

      const filePath = pathParts[1]

      // 2. Deletar do storage
      const { error } = await supabase.storage
        .from('product-lines')
        .remove([filePath])

      if (error) console.error('Erro ao deletar imagem:', error.message)
    } catch (err) {
      console.error('Erro ao processar URL da imagem:', err)
    }
  }

  const getLineColor = (lineName: string): string => {
    const line = productLines.value.find(l => l.name === lineName)
    return line?.color || '#64748b'
  }

  // ====================================
  // RETORNO (com novas funções)
  // ====================================
  return {
    productLines,
    loading,
    fetchLines,
    addLine,
    updateLine,
    deleteLine,
    getLineColor,
    uploadLineImage,    // 👈 NOVO
    deleteLineImage     // 👈 NOVO
  }
}
