/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

console.log("URL do Banco:", supabaseUrl);
console.log("Chave do Banco:", supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas no .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Upload de imagem para o Supabase Storage ───────────────────────────────
// Recebe um File ou uma string base64 e devolve a URL pública da imagem salva.
export async function uploadImage(
  fileOrBase64: File | string,
  bucket: 'products' | 'banners',
  fileName?: string
): Promise<string> {
  let file: File

  if (typeof fileOrBase64 === 'string') {
    // Converte base64 → Blob → File
    const res = await fetch(fileOrBase64)
    const blob = await res.blob()
    const ext = blob.type.split('/')[1] || 'webp'
    file = new File([blob], fileName || `${Date.now()}.${ext}`, { type: blob.type })
  } else {
    file = fileOrBase64
  }

  const ext = file.name.split('.').pop() || 'webp'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  })

  if (error) throw new Error(`Erro no upload: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
