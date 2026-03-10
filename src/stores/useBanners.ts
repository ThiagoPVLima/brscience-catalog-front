import { ref } from 'vue'
import { supabase, uploadImage } from '../lib/supabase'

export interface Banner {
  id: string
  imageUrl: string
  mobileImageUrl?: string
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
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('order')

    if (error) {
      console.error('Erro ao buscar banners:', error.message)
    } else {
      banners.value = (data || []).map(rowToBanner)
      updateActiveBanners()
    }
    loading.value = false
  }

  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    // Upload imagem web se for base64
    let imageUrl = banner.imageUrl
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = await uploadImage(imageUrl, 'banners')
    }

    // Upload imagem mobile se existir e for base64
    let mobileImageUrl = banner.mobileImageUrl
    if (mobileImageUrl && mobileImageUrl.startsWith('data:')) {
      mobileImageUrl = await uploadImage(mobileImageUrl, 'banners')
    }

    const { data, error } = await supabase
      .from('banners')
      .insert({
        image_url: imageUrl,
        mobile_image_url: mobileImageUrl || null,
        title: banner.title,
        link: banner.link || null,
        order: banner.order,
        active: banner.active
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    banners.value.push(rowToBanner(data))
    updateActiveBanners()
  }

  const updateBanner = async (id: string, updatedBanner: Partial<Banner>) => {
    let imageUrl = updatedBanner.imageUrl
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = await uploadImage(imageUrl, 'banners')
    }

    let mobileImageUrl = updatedBanner.mobileImageUrl
    if (mobileImageUrl && mobileImageUrl.startsWith('data:')) {
      mobileImageUrl = await uploadImage(mobileImageUrl, 'banners')
    }

    const { error } = await supabase
      .from('banners')
      .update({
        image_url: imageUrl,
        mobile_image_url: mobileImageUrl || null,
        title: updatedBanner.title,
        link: updatedBanner.link || null,
        order: updatedBanner.order,
        active: updatedBanner.active
      })
      .eq('id', id)

    if (error) throw new Error(error.message)

    const index = banners.value.findIndex(b => b.id === id)
    if (index !== -1) {
      banners.value[index] = {
        ...banners.value[index],
        ...updatedBanner,
        imageUrl: imageUrl || banners.value[index].imageUrl,
        mobileImageUrl: mobileImageUrl || banners.value[index].mobileImageUrl
      }
      updateActiveBanners()
    }
  }

  const deleteBanner = async (id: string) => {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    banners.value = banners.value.filter(b => b.id !== id)
    updateActiveBanners()
  }

  const updateActiveBanners = () => {
    activeBanners.value = banners.value
      .filter(b => b.active)
      .sort((a, b) => a.order - b.order)
  }

  return {
    banners,
    activeBanners,
    loading,
    fetchBanners,
    addBanner,
    updateBanner,
    deleteBanner
  }
}

function rowToBanner(row: any): Banner {
  return {
    id: row.id,
    imageUrl: row.image_url || '',
    mobileImageUrl: row.mobile_image_url || undefined,
    title: row.title,
    link: row.link || undefined,
    order: row.order,
    active: row.active
  }
}
