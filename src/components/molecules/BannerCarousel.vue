<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBanners } from '../../stores/useBanners'

const { activeBanners } = useBanners()

const currentIndex = ref(0)
const loadedSlides = ref<Set<number>>(new Set())
let autoplayInterval: NodeJS.Timeout | null = null

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
const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; stopAutoplay() }
const onTouchEnd = (e: TouchEvent) => {
  const delta = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(delta) > 40) delta > 0 ? nextSlide() : prevSlide()
  startAutoplay()
}

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
          class="[grid-area:1/1/2/2] relative w-full h-auto">

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
            </div>
          </div>
        </div>
      </TransitionGroup>

      <button v-if="activeBanners.length > 1" @click="prevSlide"
        class="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md items-center justify-center text-white transition-all z-20">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button v-if="activeBanners.length > 1" @click="nextSlide"
        class="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md items-center justify-center text-white transition-all z-20">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div v-if="activeBanners.length > 1"
        class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
        <button v-for="(_, index) in activeBanners" :key="index" @click="goToSlide(index)" :class="[
          'h-1 sm:h-1.5 rounded-full transition-all duration-300',
          index === currentIndex ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
        ]" />
      </div>
    </div>
  </div>

  <div v-else
    class="w-full rounded-3xl bg-slate-50 dark:bg-[#161a22] border-2 border-dashed border-slate-200 dark:border-[#242a36] flex items-center justify-center py-20 px-6">
    <div class="flex flex-col items-center text-center text-slate-400">
      <div class="p-4 bg-slate-100 dark:bg-[#1d222b] rounded-2xl mb-4">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="text-xs font-black uppercase tracking-widest">Nenhum banner ativo</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(200%);
  }
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
