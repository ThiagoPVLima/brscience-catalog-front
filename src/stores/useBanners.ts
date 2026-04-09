// ══════════════════════════════════════════════════════════════════
//  useBanners.ts
// ══════════════════════════════════════════════════════════════════
import { ref } from 'vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface Banner {
  id: string
  imageUrl: string | File
  mobileImageUrl?: string | File
  title: string
  link?: string
  order: number
  active: boolean
}

const banners = ref<Banner[]>([])
const activeBanners = ref<Banner[]>([])
const loading = ref(false)

export function useBanners() {

  const fetchBanners = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API}/banners`)
      const data = await res.json()
      banners.value = (data || []).map(rowToBanner)
      updateActiveBanners()
    } catch (err) {
      console.error('Erro ao buscar banners:', err)
    } finally {
      loading.value = false
    }
  }

  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    const form = new FormData()
    form.append('title', banner.title)
    form.append('order', String(banner.order))
    form.append('active', String(banner.active))
    if (banner.link) form.append('link', banner.link)

    if (banner.imageUrl instanceof File) {
      form.append('image', banner.imageUrl)
    } else {
      form.append('image_url', banner.imageUrl)
    }

    if (banner.mobileImageUrl) {
      if (banner.mobileImageUrl instanceof File) {
        form.append('mobileImage', banner.mobileImageUrl)
      } else {
        form.append('mobile_image_url', banner.mobileImageUrl)
      }
    }

    const res = await fetch(`${API}/banners`, { method: 'POST', body: form })
    if (!res.ok) {
      let msg = 'Erro ao criar banner'
      try { const e = await res.json(); msg = e.error || e.message || msg } catch {}
      throw new Error(msg)
    }

    const data = await res.json()
    banners.value.push(rowToBanner(data))
    updateActiveBanners()
  }

  const updateBanner = async (id: string, updatedBanner: Partial<Banner>) => {
    const form = new FormData()
    if (updatedBanner.title !== undefined) form.append('title', updatedBanner.title)
    if (updatedBanner.order !== undefined) form.append('order', String(updatedBanner.order))
    if (updatedBanner.active !== undefined) form.append('active', String(updatedBanner.active))
    if (updatedBanner.link !== undefined) form.append('link', updatedBanner.link || '')

    if (updatedBanner.imageUrl) {
      if (updatedBanner.imageUrl instanceof File) {
        form.append('image', updatedBanner.imageUrl)
      } else {
        form.append('image_url', updatedBanner.imageUrl)
      }
    }
    if (updatedBanner.mobileImageUrl) {
      if (updatedBanner.mobileImageUrl instanceof File) {
        form.append('mobileImage', updatedBanner.mobileImageUrl)
      } else {
        form.append('mobile_image_url', updatedBanner.mobileImageUrl)
      }
    }

    const res = await fetch(`${API}/banners/${id}`, { method: 'PUT', body: form })
    if (!res.ok) {
      let msg = 'Erro ao atualizar banner'
      try { const e = await res.json(); msg = e.error || e.message || msg } catch {}
      throw new Error(msg)
    }

    const index = banners.value.findIndex(b => b.id === id)
    if (index !== -1) {
      banners.value[index] = { ...banners.value[index], ...updatedBanner }
      updateActiveBanners()
    }
  }

  const deleteBanner = async (id: string) => {
    const res = await fetch(`${API}/banners/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      let msg = 'Erro ao excluir banner'
      try { const e = await res.json(); msg = e.error || e.message || msg } catch {}
      throw new Error(msg)
    }
    banners.value = banners.value.filter(b => b.id !== id)
    updateActiveBanners()
  }

  const updateActiveBanners = () => {
    activeBanners.value = banners.value
      .filter(b => b.active)
      .sort((a, b) => a.order - b.order)
  }

  return { banners, activeBanners, loading, fetchBanners, addBanner, updateBanner, deleteBanner }
}

function rowToBanner(row: any): Banner {
  return {
    id: String(row.id),
    imageUrl: row.image_url || '',
    mobileImageUrl: row.mobile_image_url || undefined,
    title: row.title,
    link: row.link || undefined,
    order: row.order,
    active: Boolean(row.active)
  }
}
