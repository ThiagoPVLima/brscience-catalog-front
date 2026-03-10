<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import type { Product } from '../../types/products';

interface ProductDetail extends Product {
  color?: string;
}

const props = defineProps<{
  isOpen: boolean;
  product: ProductDetail | null;
}>();

const emit = defineEmits(['close', 'add']);
const quantity = ref(1);
const imageLoaded = ref(false);

const addToCart = () => {
  if (props.product) emit('add', { ...props.product, quantity: quantity.value });
};

watch(() => props.isOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
  if (val) { quantity.value = 1; imageLoaded.value = false; }
}, { immediate: true });

onUnmounted(() => { document.body.style.overflow = ''; });

const formatCurrency = (val: string | number) => {
  if (!val) return '';
  const value = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
</script>

<template>
  <div v-if="isOpen && product"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all"
    @click.self="$emit('close')">
    <div
      class="bg-white dark:bg-[#161a22] w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative">

      <button @click="$emit('close')"
        class="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-[#242a36]/80 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- IMAGEM -->
      <div
        class="w-full md:w-1/2 bg-[#f8fafc] dark:bg-[#0f1115] relative overflow-hidden h-[320px] md:h-auto flex items-center justify-center p-6">
        <div v-if="!imageLoaded" class="absolute inset-0 overflow-hidden bg-slate-100 dark:bg-[#1d222b]">
          <div
            class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent" />
        </div>

        <img :src="product.imageweb || product.image" :alt="product.name"
          :class="['max-w-full max-h-full object-contain transition-all duration-500', imageLoaded ? 'opacity-100' : 'opacity-0']"
          loading="eager" decoding="async" @load="imageLoaded = true" />
      </div>

      <div class="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
        <span class="text-[10px] font-black uppercase tracking-[3px] mb-2"
          :style="{ color: product.color || '#6b8cff' }">
          {{ product.line }}
        </span>

        <h2 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-tight mb-4">
          {{ product.name }}
        </h2>

        <div class="mb-6">
          <div class="flex items-center gap-2 mb-1">
            <p v-if="product.discountPercentage" class="text-sm text-slate-400 line-through">
              R$ {{ (parseFloat(product.price.replace(',', '.')) / (1 - product.discountPercentage /
                100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </p>
            <span v-if="product.discountPercentage"
              class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
              -{{ product.discountPercentage }}%
            </span>
          </div>
          <p class="text-3xl font-black text-slate-900 dark:text-white">
            R$ {{ product.price }}
          </p>
        </div>

        <div class="space-y-2 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#0f1115]">
          <p v-if="product.code" class="text-xs text-slate-500"><span class="font-bold">Código:</span> {{ product.code
            }}</p>
          <p v-if="product.ncm" class="text-xs text-slate-500"><span class="font-bold">NCM:</span> {{ product.ncm }}</p>
          <p v-if="product.cest" class="text-xs text-slate-500"><span class="font-bold">CEST:</span> {{ product.cest }}
          </p>
          <p v-if="product.anvisa" class="text-xs text-slate-500"><span class="font-bold">ANVISA:</span> {{
            product.anvisa }}</p>
        </div>

        <div class="flex items-center gap-3 mb-6">
          <button @click="quantity = Math.max(1, quantity - 1)"
            class="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#242a36] font-bold text-lg flex items-center justify-center hover:bg-slate-200 transition-colors">−</button>
          <span class="text-xl font-black w-8 text-center">{{ quantity }}</span>
          <button @click="quantity++"
            class="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#242a36] font-bold text-lg flex items-center justify-center hover:bg-slate-200 transition-colors">+</button>
        </div>

        <button @click="addToCart"
          class="w-full py-4 rounded-2xl font-black uppercase text-white text-sm tracking-widest transition-all active:scale-95 shadow-lg"
          :style="{ backgroundColor: product.color || '#3b82f6' }">
          Adicionar ao Carrinho
        </button>
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
