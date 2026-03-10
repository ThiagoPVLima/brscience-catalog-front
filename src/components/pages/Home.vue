<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProducts } from '../../stores/useProducts'
import { useProductLines } from '../../stores/useProductLines'
import type { Product } from '../../types/products'
import { useCarrinho } from '../composables/useCarrinho'

import ProductCard from '../molecules/ProductCard.vue'
import CartModal from '../organism/CartModal.vue'
import ProductDetailsModal from '../organism/ProductDetailsModal.vue'
import BaseInput from '../atoms/BaseInput.vue'
import ThemeToggle from '../atoms/ThemeToggle.vue'
import ScroolToTop from '../atoms/ScroolToTop.vue'
import BannerCarousel from '../molecules/BannerCarousel.vue'
import AppFooter from '../organism/Appfooter.vue'

const { productList: products } = useProducts()
const { productLines } = useProductLines()

// Converter linhas para objeto de cores
const lineHexColors = computed(() => {
  return productLines.value.reduce((acc, line) => {
    acc[line.name] = line.color
    return acc
  }, {} as Record<string, string>)
})

const isCartOpen = ref(false)
const searchTerm = ref('')
const selectedLine = ref('Todos')

const isDetailsOpen = ref(false)
const selectedProduct = ref<(Product & { quantity?: number; color?: string }) | null>(null)

const { quantidadeTotal, adicionar } = useCarrinho()

const groupedProducts = computed(() => {
  const termo = searchTerm.value.toLowerCase()

  const filtered = products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(termo) || p.line.toLowerCase().includes(termo)
    const matchesLine = selectedLine.value === 'Todos' || p.line === selectedLine.value
    return matchesSearch && matchesLine
  })

  return filtered.reduce((acc, product) => {
    if (!acc[product.line]) acc[product.line] = []
    acc[product.line].push(product)
    return acc;
  }, {} as Record<string, any>)
})

const openProductDetails = (product: any, color: string) => {
  selectedProduct.value = { ...product, color };
  isDetailsOpen.value = true;
}

const handleAddToCartFromModal = (product: any) => {
  adicionar(product);
  isDetailsOpen.value = false;
  isCartOpen.value = true;
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f1115] text-slate-900 dark:text-gray-200 transition-colors duration-300">
    <header
      class="sticky top-0 z-30 bg-white/80 dark:bg-[#161a22]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#242a36] p-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <router-link to="/login" class="hover:opacity-80 transition-opacity">
          <img src="/assets/BRSCIENCE - BRANCO.png" class="h-8 sm:h-10 dark:opacity-90 invert dark:invert-0"
            alt="Logo BRSCIENCE" />
        </router-link>

        <div class="flex items-center gap-2 flex-1 max-w-md mx-2">
          <BaseInput v-model="searchTerm" placeholder="Buscar produto..." />
        </div>

        <div class="flex items-center gap-2">
          <ThemeToggle />
          <button type="button" @click="isCartOpen = true"
            class="relative p-2 rounded-full bg-slate-100 dark:bg-[#242a36] hover:bg-slate-200 dark:hover:bg-[#2e3444]">
            <span class="text-xl sm:text-2xl">🛒</span>
            <span v-if="quantidadeTotal > 0"
              class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {{ quantidadeTotal }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-4 w-full flex-1">

      <!-- Banner Carousel -->
      <div class="mb-8">
        <BannerCarousel />
      </div>

      <!-- Filtro de Linhas -->
      <div class="relative">
        <div class="flex items-center gap-5 overflow-x-auto pb-8 pt-4 no-scrollbar scroll-smooth pr-10">
          <button @click="selectedLine = 'Todos'" class="flex flex-col items-center gap-2 min-w-[70px] group">
            <div :class="[
              'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300',
              selectedLine === 'Todos'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 scale-110 shadow-lg'
                : 'border-slate-200 dark:border-[#242a36]'
            ]">
              <span class="text-[10px] font-black uppercase text-slate-400">Tudo</span>
            </div>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Geral</span>
          </button>

          <button v-for="line in productLines" :key="line.name" @click="selectedLine = line.name"
            class="flex flex-col items-center gap-2 min-w-[80px] group">
            <div
              :style="selectedLine === line.name ? { borderColor: line.color, backgroundColor: line.color + '15' } : {}"
              :class="[
                'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 overflow-hidden',
                selectedLine === line.name ? 'scale-110 shadow-lg' : 'border-slate-200 dark:border-[#242a36]'
              ]">
              <!-- Se tem imagem, mostrar imagem -->
              <img v-if="line.imageUrl" :src="line.imageUrl" :alt="line.name" class="w-full h-full object-cover" />
              <!-- Senão, mostrar texto -->
              <span v-else class="text-[9px] font-black uppercase text-center px-1"
                :style="{ color: selectedLine === line.name ? line.color : '' }">
                {{ line.name.split(' ')[0] }}
              </span>
            </div>
            <span :class="['text-[9px] font-black uppercase tracking-widest transition-colors truncate whitespace-nowrap max-w-[80px] text-center',
              selectedLine === line.name ? 'text-slate-900 dark:text-white' : 'text-slate-500']" :title="line.name">
              {{ line.name }}
            </span>
          </button>
        </div>
        <div
          class="pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-slate-50 dark:from-[#0f1115] to-transparent">
        </div>
      </div>

      <!-- Produtos por Linha -->
      <div v-for="(group, lineName) in groupedProducts" :key="lineName" class="mb-12">
        <h2 class="text-sm sm:text-base font-bold uppercase tracking-widest mb-5 pl-5 border-l-4"
          :style="{ borderColor: lineHexColors[lineName] || '#64748b' }">
          Linha {{ lineName }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard v-for="p in group" :key="p.code" v-bind="p" :color="lineHexColors[lineName]"
            @click="openProductDetails(p, lineHexColors[lineName])" />
        </div>
      </div>

      <div v-if="Object.keys(groupedProducts).length === 0" class="text-center py-20">
        <p class="text-slate-400 font-black uppercase tracking-widest">Nenhum produto encontrado</p>
      </div>
    </main>

    <CartModal :is-open="isCartOpen" @close="isCartOpen = false" />

    <ProductDetailsModal :is-open="isDetailsOpen" :product="selectedProduct" @close="isDetailsOpen = false"
      @add="handleAddToCartFromModal" />

    <ScroolToTop />

    <AppFooter />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
