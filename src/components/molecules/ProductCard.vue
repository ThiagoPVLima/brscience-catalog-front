<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCarrinho } from '../composables/useCarrinho'
import { DEFAULT_PRODUCT_IMAGE } from '../../constants/images'
import type { Product } from '../../types/products';

const props = defineProps<Product>()
const { adicionar } = useCarrinho()
const showDetails = ref(false)

const handleAddToCart = () => { adicionar({ ...props }) }
const onImageError = (e: Event) => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE }

const originalPrice = computed(() => {
  if (!props.discountPercentage || props.discountPercentage <= 0) return null;
  const atual = parseFloat(props.price.replace(',', '.'));
  if (isNaN(atual)) return null;
  const antigo = atual / (1 - props.discountPercentage / 100);
  return antigo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
})

// Skeleton state
const imageLoaded = ref(false)
const onImageLoad = () => { imageLoaded.value = true }
</script>

<template>
  <div @click="$emit('click')"
    class="cursor-pointer relative rounded-2xl flex flex-col h-full min-h-[340px] bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#242a36] hover:shadow-lg transition-all overflow-hidden">

    <div v-if="discountPercentage"
      class="absolute top-2 left-2 z-10 flex items-center gap-0.5 bg-[#e8f5f2] text-[#2ba089] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d1e9e4]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="3">
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      <span>{{ discountPercentage }}%</span>
    </div>

    <div class="relative w-full aspect-square overflow-hidden bg-slate-50 dark:bg-[#0f1115]">
      <!-- Skeleton shimmer -->
      <div v-if="!imageLoaded" class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-slate-200 dark:bg-[#1d222b]" />
        <div
          class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer" />
      </div>
      <img :src="imageweb || image || DEFAULT_PRODUCT_IMAGE"
        :class="['absolute inset-0 w-full h-full object-cover transition-opacity duration-500', imageLoaded ? 'opacity-100' : 'opacity-0']"
        decoding="async" @load="onImageLoad" @error="onImageError" />
    </div>

    <div class="flex flex-col flex-1 p-3">
      <h3
        class="font-semibold text-[11px] sm:text-[13px] text-slate-800 dark:text-gray-200 leading-tight mb-2 line-clamp-2">
        {{ name }}
      </h3>

      <div class="mt-auto">
        <p v-if="originalPrice" class="text-[11px] text-slate-400 line-through font-medium leading-none mb-1">
          R$ {{ originalPrice }}
        </p>
        <p class="font-bold text-base sm:text-xl text-slate-900 dark:text-white leading-none">
          R$ {{ price }}
        </p>
      </div>

      <button @click.stop="handleAddToCart"
        class="mt-4 py-3 rounded-full text-[10px] sm:text-xs uppercase font-black text-white hover:brightness-110 active:scale-95 transition-all shadow-sm"
        :style="{ backgroundColor: color }">
        Adicionar
      </button>

      <button @click.stop="showDetails = !showDetails"
        class="mt-3 flex items-center justify-between text-[9px] font-bold uppercase text-slate-400 dark:text-gray-400 hover:text-slate-600">
        <span>Especificações</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform"
          :class="{ 'rotate-180': showDetails }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-if="showDetails"
        class="mt-2 p-2 rounded text-[9px] bg-slate-50 dark:bg-[#0f1115] border border-slate-100 dark:border-[#242a36] text-slate-500">
        <p><strong>CÓD:</strong> {{ code }}</p>
        <p v-if="ncm"><strong>NCM:</strong> {{ ncm }}</p>
        <p v-if="anvisa"><strong>ANVISA:</strong> {{ anvisa }}</p>
      </div>
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
</style>
