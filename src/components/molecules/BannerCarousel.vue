<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBanners, type Banner } from '../../stores/useBanners'
import { useVendedores } from '../../stores/useVendedores'

const { activeBanners } = useBanners()
const { vendedorList } = useVendedores()

const emit = defineEmits<{
  (e: 'openPromo', productCodes: string[]): void
}>()

const currentIndex = ref(0)
const loadedSlides = ref<Set<number>>(new Set())
let autoplayInterval: NodeJS.Timeout | null = null
let isSwiping = false

const onSlideLoad = (index: number) => { loadedSlides.value.add(index) }

const nextSlide = () => {
  if (activeBanners.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % activeBanners.value.length
}

const prevSlide = () => {
  if (activeBanners.value.length === 0) return
  currentIndex.value = currentIndex.value === 0
    ? activeBanners.value.length - 1
    : currentIndex.value - 1
}

const goToSlide = (index: number) => { currentIndex.value = index }

const startAutoplay = () => {
  if (activeBanners.value.length <= 1) return
  autoplayInterval = setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null }
}

let touchStartX = 0
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
  isSwiping = false
  stopAutoplay()
}
const onTouchEnd = (e: TouchEvent) => {
  const delta = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(delta) > 40) {
    isSwiping = true
    delta > 0 ? nextSlide() : prevSlide()
  }
  startAutoplay()
}

// Link sem query params → redireciona para Matheus no WhatsApp
const matheusPhone = computed(() => {
  const matheus = vendedorList.value.find(v =>
    v.nome.toLowerCase().includes('matheus')
  )
  return matheus ? matheus.whatsapp.replace(/\D/g, '') : null
})

const buildMatheusLink = (banner?: Banner) => {
  const phone = matheusPhone.value
  if (!phone) return null
  let msg = 'Olá! Vi uma promoção no site e tenho interesse.'
  if (banner?.title) {
    msg = banner.promoPrice
      ? `Olá! Vi a promoção "${banner.title}" por ${banner.promoPrice} e tenho interesse!`
      : `Olá! Vi a promoção "${banner.title}" no site e tenho interesse!`
  }
  return `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`
}

const matheusLink = computed(() => buildMatheusLink())

const hasQueryParams = (url: string): boolean => {
  try { return new URL(url).search !== '' } catch { return false }
}

const handleBannerClick = (banner: Banner) => {
  if (isSwiping) { isSwiping = false; return }

  if (!banner.link) {
    const link = buildMatheusLink(banner)
    if (link) window.open(link, '_blank')
    return
  }

  if (banner.link.startsWith('promo:')) {
    const codes = banner.link.replace('promo:', '').split(',').filter(Boolean)
    emit('openPromo', codes)
    return
  }

  if (!hasQueryParams(banner.link)) {
    // Link sem query params → Matheus com contexto do banner
    const link = buildMatheusLink(banner)
    if (link) window.open(link, '_blank')
    else window.open(banner.link, '_blank')
    return
  }

  window.open(banner.link, '_blank')
}

const bannerHasAction = (banner: Banner) =>
  !!banner.link || !!matheusPhone.value

onMounted(() => { startAutoplay() })
onUnmounted(() => { stopAutoplay() })
</script>

<template>
  <div v-if="activeBanners.length > 0"
    class="relative w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-[#1d222b] shadow-xl border border-slate-200 dark:border-[#242a36]"
    @mouseenter="stopAutoplay" @mouseleave="startAutoplay">

    <div class="grid" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <TransitionGroup name="slide">
        <div v-for="(banner, index) in activeBanners" v-show="index === currentIndex" :key="banner.id"
          class="[grid-area:1/1/2/2] relative w-full h-auto"
          :class="bannerHasAction(banner) ? 'cursor-pointer' : ''"
          @click="handleBannerClick(banner)">

          <div v-if="!loadedSlides.has(index)" class="absolute inset-0 bg-slate-200 dark:bg-[#1d222b] overflow-hidden">
            <div
              class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
          </div>

          <img :src="banner.imageUrl" :alt="banner.title"
            :class="['w-full h-auto block sm:block transition-opacity duration-500', loadedSlides.has(index) ? 'opacity-100' : 'opacity-0']"
            :loading="index === 0 ? 'eager' : 'lazy'" @load="onSlideLoad(index)" />

          <img :src="banner.mobileImageUrl || banner.imageUrl" :alt="banner.title"
            :class="['w-full h-auto block sm:hidden transition-opacity duration-500', loadedSlides.has(index) ? 'opacity-100' : 'opacity-0']"
            :loading="index === 0 ? 'eager' : 'lazy'" @load="onSlideLoad(index)" />

          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none flex flex-col justify-end">
            <div class="p-4 sm:p-10">
              <h3
                class="text-white text-sm sm:text-3xl font-black uppercase tracking-tighter drop-shadow-2xl line-clamp-2 max-w-2xl">
                {{ banner.title }}
              </h3>
              <p v-if="bannerHasAction(banner)"
                class="mt-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/70">
                Clique para saber mais →
              </p>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <button v-if="activeBanners.length > 1" @click.stop="prevSlide"
        class="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md items-center justify-center text-white transition-all z-20">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button v-if="activeBanners.length > 1" @click.stop="nextSlide"
        class="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md items-center justify-center text-white transition-all z-20">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div v-if="activeBanners.length > 1"
        class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
        <button v-for="(_, index) in activeBanners" :key="index" @click.stop="goToSlide(index)" :class="[
          'h-1 sm:h-1.5 rounded-full transition-all duration-300',
          index === currentIndex ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
        ]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(200%); }
}

.animate-shimmer {
  animation: shimmer 1.6s infinite;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
