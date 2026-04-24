<script setup lang="ts">
import { computed, watch } from 'vue'
import { useProducts } from '../../stores/useProducts'
import { useProductLines } from '../../stores/useProductLines'
import type { Product } from '../../types/products'

const props = defineProps<{
  isOpen: boolean
  productCodes: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'addToCart', product: Product & { color?: string }): void
  (e: 'viewProduct', product: Product & { color?: string }): void
}>()

const { productList } = useProducts()
const { productLines } = useProductLines()

const lineColors = computed(() =>
  productLines.value.reduce((acc, l) => { acc[l.name] = l.color; return acc }, {} as Record<string, string>)
)

const promoProducts = computed(() =>
  props.productCodes
    .map(code => productList.value.find(p => p.code === code))
    .filter(Boolean) as Product[]
)

const formatPrice = (val: string | number) => {
  const v = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

watch(() => props.isOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen && promoProducts.length > 0"
        class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md"
        @click.self="$emit('close')">

        <div
          class="bg-white dark:bg-[#161a22] w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-[#242a36] flex flex-col max-h-[90vh]">

          <div
            class="p-5 sm:p-6 border-b border-slate-100 dark:border-[#242a36] flex justify-between items-center">
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-0.5">Promoção Especial</p>
              <h2 class="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white">
                Produtos em Destaque
              </h2>
            </div>
            <button @click="$emit('close')"
              class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div v-for="p in promoProducts" :key="p.code"
                class="bg-slate-50 dark:bg-[#0f1115] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#242a36] flex flex-col hover:shadow-lg transition-all duration-200">

                <div class="relative aspect-square overflow-hidden bg-white dark:bg-[#161a22]">
                  <img :src="(p.imageweb || p.image) as string" :alt="p.name"
                    class="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300" />
                  <span v-if="p.discountPercentage"
                    class="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black uppercase rounded-md shadow">
                    -{{ p.discountPercentage }}%
                  </span>
                </div>

                <div class="p-3 flex flex-col gap-2 flex-1">
                  <span class="text-[9px] font-black uppercase tracking-widest"
                    :style="{ color: lineColors[p.line] || '#6b8cff' }">
                    {{ p.line }}
                  </span>
                  <p class="text-xs font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight">{{ p.name }}</p>
                  <p class="text-sm font-black text-slate-900 dark:text-white mt-auto">
                    {{ formatPrice(p.price) }}
                  </p>
                  <button
                    @click="emit('viewProduct', { ...p, color: lineColors[p.line] })"
                    class="w-full py-2 rounded-xl text-[10px] font-black uppercase text-white transition-all active:scale-95 shadow"
                    :style="{ backgroundColor: lineColors[p.line] || '#3b82f6' }">
                    Ver Produto
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-6 bg-slate-50 dark:bg-[#1d222b] border-t border-slate-100 dark:border-[#242a36]">
            <p class="text-center text-[9px] text-slate-400 font-medium uppercase tracking-widest">
              Promoção válida por tempo limitado · Fale com nosso time para mais informações
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active { transition: all 0.3s ease-out; }
.modal-fade-leave-active { transition: all 0.2s ease-in; }
.modal-fade-enter-from { opacity: 0; transform: translateY(24px); }
.modal-fade-leave-to { opacity: 0; transform: translateY(16px); }

@media (min-width: 640px) {
  .modal-fade-enter-from { opacity: 0; transform: scale(0.96); }
  .modal-fade-leave-to { opacity: 0; transform: scale(0.96); }
}
</style>
