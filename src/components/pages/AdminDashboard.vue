<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0f1115] p-4 sm:p-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">

      <div class="flex flex-col gap-6 mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 class="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">Gerenciamento</h1>
            <p class="text-sm text-slate-500">Controle total do catálogo BRSCIENCE</p>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <ThemeToggle />
            <router-link to="/"
              class="px-4 py-2 text-[10px] font-black border border-slate-300 dark:border-[#242a36] rounded-xl hover:bg-white dark:hover:bg-[#1d222b] text-slate-600 dark:text-gray-400 transition-all">
              VOLTAR PARA LOJA
            </router-link>
            <button v-if="activeTab === 'products'" @click="openProductModal()"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">
              + Novo Produto
            </button>
            <button v-if="activeTab === 'lines'" @click="openLineModal()"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">
              + Nova Linha
            </button>
            <button v-if="activeTab === 'banners'" @click="openBannerModal()"
              class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">
              + Novo Banner
            </button>
            <button v-if="activeTab === 'vendedores'" @click="openVendedorModal()"
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">
              + Novo Vendedor
            </button>
          </div>
        </div>

        <div class="flex gap-2 border-b border-slate-200 dark:border-[#242a36] overflow-x-auto">
          <button v-for="tab in (['products', 'lines', 'banners', 'vendedores'] as const)" :key="tab"
            @click="activeTab = tab" :class="[
              'px-4 py-3 text-[10px] font-black uppercase transition-all whitespace-nowrap',
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'
            ]">
            {{ tab === 'products' ? 'Produtos' : tab === 'lines' ? 'Linhas' : tab === 'banners' ? 'Banners' :
              'Vendedores'
            }}
          </button>
        </div>

        <div v-if="activeTab === 'products'" class="max-w-md">
          <BaseInput v-model="searchQuery" placeholder="Buscar por nome ou código..." :show-search-icon="true" />
        </div>
      </div>

      <div v-if="activeTab === 'products'"
        class="bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#242a36] rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-[#1d222b] border-b border-slate-200 dark:border-[#242a36]">
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Produto</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Linha</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Código</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Preço</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="product in filteredProducts" :key="product.code"
                class="hover:bg-slate-50/50 dark:hover:bg-[#1d222b]/30 transition-colors">
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">
                  <div class="flex items-center gap-3">
                    <img :src="(product.image || product.imageweb) as string"
                      class="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-[#0f1115]" />
                    <span class="line-clamp-1">{{ product.name }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <span class="px-2 py-1 text-[9px] font-black uppercase rounded-md" :style="{
                    backgroundColor: getLineColor(product.line) + '20',
                    color: getLineColor(product.line)
                  }">
                    {{ product.line }}
                  </span>
                </td>
                <td class="p-4 text-xs font-mono text-slate-500">{{ product.code }}</td>
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">R$ {{ product.price }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openProductModal(product)" class="p-2 text-blue-500">✏️</button>
                    <button @click="handleDeleteProduct(product.code)" class="p-2 text-red-500">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'lines'"
        class="bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#242a36] rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-[#1d222b] border-b border-slate-200 dark:border-[#242a36]">
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Linha</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Imagem</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="line in productLines" :key="line.name" class="hover:bg-slate-50/50 dark:hover:bg-[#1d222b]/30">
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">{{ line.name }}</td>
                <td class="p-4">
                  <img v-if="line.imageUrl" :src="line.imageUrl as string"
                    class="w-10 h-10 rounded-full object-cover" />
                </td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openLineModal(line)" class="p-2 text-blue-500">✏️</button>
                    <button @click="handleDeleteLine(line.name)" class="p-2 text-red-500">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'banners'"
        class="bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#242a36] rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-[#1d222b] border-b border-slate-200 dark:border-[#242a36]">
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Preview</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Título</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="banner in sortedBanners" :key="banner.id" class="hover:bg-slate-50/50">
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <img :src="banner.imageUrl as string" class="w-20 h-12 rounded-lg object-cover bg-slate-100" />
                    <img v-if="banner.mobileImageUrl" :src="banner.mobileImageUrl as string"
                      class="w-8 h-12 rounded-lg object-cover bg-slate-100" />
                  </div>
                </td>
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">{{ banner.title }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openBannerModal(banner)" class="p-2 text-blue-500">✏️</button>
                    <button @click="handleDeleteBanner(banner.id)" class="p-2 text-red-500">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'vendedores'"
        class="bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#242a36] rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-[#1d222b] border-b border-slate-200 dark:border-[#242a36]">
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Vendedor</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">WhatsApp</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="vendedor in vendedorList" :key="vendedor.id" class="hover:bg-slate-50/50">
                <td class="p-4 flex items-center gap-3">
                  <img v-if="vendedor.avatar_url" :src="vendedor.avatar_url as string" class="w-10 h-10 rounded-xl" />
                  <span class="text-sm font-bold">{{ vendedor.nome }}</span>
                </td>
                <td class="p-4 text-xs font-mono">+{{ vendedor.whatsapp }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openVendedorModal(vendedor)" class="p-2 text-blue-500">✏️</button>
                    <button @click="handleDeleteVendedor(vendedor.id)" class="p-2 text-red-500">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <AdminModal :is-open="isProductModalOpen" :product-data="selectedProduct" @close="isProductModalOpen = false"
      @save="handleSaveProduct" />
    <LineModal :is-open="isLineModalOpen" :line-data="selectedLine" @close="isLineModalOpen = false"
      @save="handleSaveLine" />
    <BannerModal :is-open="isBannerModalOpen" :banner-data="selectedBanner" @close="isBannerModalOpen = false"
      @save="handleSaveBanner" />
    <VendedorModal :is-open="isVendedorModalOpen" :vendedor-data="selectedVendedor" @close="isVendedorModalOpen = false"
      @save="handleSaveVendedor" />

    <ScroolToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProducts } from '../../stores/useProducts'
import { useProductLines, type ProductLine } from '../../stores/useProductLines'
import { useBanners, type Banner } from '../../stores/useBanners'
import { useVendedores, type Vendedor } from '../../stores/useVendedores'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'
import type { Product } from '../../types/products'

import BaseInput from '../atoms/BaseInput.vue'
import ThemeToggle from '../atoms/ThemeToggle.vue'
import ScroolToTop from '../atoms/ScroolToTop.vue'
import AdminModal from '../organism/AdminModal.vue'
import LineModal from '../organism/LineModal.vue'
import BannerModal from '../organism/BannerModal.vue'
import VendedorModal from '../organism/VendedorModal.vue'

// Stores
const { productList, addProduct, updateProduct, deleteProduct } = useProducts()
const productLinesStore = useProductLines() // Pegando o objeto completo para evitar erro de propriedade inexistente
const { banners, addBanner, updateBanner, deleteBanner } = useBanners()
const { vendedorList, addVendedor, updateVendedor, deleteVendedor } = useVendedores()

// Atalhos para as refs da store de linhas
const productLines = computed(() => productLinesStore.productLines.value)

// Utilities
const { success, error } = useToast()
const { confirm } = useConfirm()

// Estado
const searchQuery = ref('')
const activeTab = ref<'products' | 'lines' | 'banners' | 'vendedores'>('products')

const isProductModalOpen = ref(false)
const isLineModalOpen = ref(false)
const isBannerModalOpen = ref(false)
const isVendedorModalOpen = ref(false)

const selectedProduct = ref<Product | null>(null)
const selectedLine = ref<ProductLine | null>(null)
const selectedBanner = ref<Banner | null>(null)
const selectedVendedor = ref<Vendedor | null>(null)

// Produtos filtrados
const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return productList.value
  return productList.value.filter((p: Product) =>
    p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)
  )
})

const sortedBanners = computed(() => {
  return [...banners.value].sort((a, b) => a.order - b.order)
})

const getLineColor = (lineName: string) => {
  const line = productLines.value.find(l => l.name === lineName)
  return line?.color || '#3b82f6'
}

// ===== HANDLERS =====

// PRODUTOS
const openProductModal = (product?: Product) => {
  selectedProduct.value = product ? { ...product } : null
  isProductModalOpen.value = true
}

const handleSaveProduct = async (formData: Product) => {
  try {
    if (selectedProduct.value) {
      const confirmed = await confirm({ title: 'Confirmar', message: `Atualizar ${formData.name}?`, type: 'info' })
      if (confirmed) {
        await updateProduct(formData, selectedProduct.value.code)
        success('Produto atualizado!')
        isProductModalOpen.value = false
      }
    } else {
      await addProduct(formData)
      success('Produto cadastrado!')
      isProductModalOpen.value = false
    }
  } catch (err) { error('Erro ao salvar produto.') }
}

const handleDeleteProduct = async (code: string) => {
  if (await confirm({ title: 'Excluir', message: 'Tem certeza?', type: 'danger' })) {
    await deleteProduct(code)
    success('Excluído!')
  }
}

// LINHAS (Corrigido Erro 2339)
const openLineModal = (line?: ProductLine) => {
  selectedLine.value = line ? { ...line } : null
  isLineModalOpen.value = true
}

const handleSaveLine = async (formData: ProductLine & { imageFile?: File }) => {
  try {
    let imageUrl = formData.imageUrl

    // Verifica se a função de upload existe na store
    if (formData.imageFile && 'uploadLineImage' in productLinesStore) {
      imageUrl = await (productLinesStore as any).uploadLineImage(formData.imageFile, formData.name)
    }

    const lineData: ProductLine = {
      name: formData.name,
      color: formData.color,
      imageUrl
    }

    if (selectedLine.value) {
      if (await confirm({ title: 'Confirmar', message: `Atualizar linha ${formData.name}?` })) {
        await productLinesStore.updateLine(selectedLine.value.name, lineData)
        success('Linha atualizada!')
        isLineModalOpen.value = false
      }
    } else {
      await productLinesStore.addLine(lineData)
      success('Linha criada!')
      isLineModalOpen.value = false
    }
  } catch (err: any) { error(err.message || 'Erro ao salvar linha.') }
}

const handleDeleteLine = async (name: string) => {
  if (productList.value.some((p: Product) => p.line === name)) {
    return error('Existem produtos nesta linha.')
  }
  if (await confirm({ title: 'Excluir', message: 'Tem certeza?', type: 'danger' })) {
    await productLinesStore.deleteLine(name)
    success('Excluída!')
  }
}

// BANNERS
const openBannerModal = (banner?: Banner) => {
  selectedBanner.value = banner ? { ...banner } : null
  isBannerModalOpen.value = true
}

const handleSaveBanner = async (formData: Omit<Banner, 'id'>) => {
  try {
    if (selectedBanner.value) {
      await updateBanner(selectedBanner.value.id, formData)
      success('Banner atualizado!')
    } else {
      await addBanner(formData)
      success('Banner criado!')
    }
    isBannerModalOpen.value = false
  } catch (err) { error('Erro ao salvar banner.') }
}

const handleDeleteBanner = async (id: string) => {
  if (await confirm({ title: 'Excluir', message: 'Deseja excluir o banner?', type: 'danger' })) {
    await deleteBanner(id)
    success('Banner excluído!')
  }
}

// VENDEDORES
const openVendedorModal = (vendedor?: Vendedor) => {
  selectedVendedor.value = vendedor ? { ...vendedor } : null
  isVendedorModalOpen.value = true
}

const handleSaveVendedor = async (formData: Omit<Vendedor, 'id'>, avatarFile?: File | null) => {
  try {
    if (selectedVendedor.value) {
      await updateVendedor(selectedVendedor.value.id, formData, avatarFile || undefined)
      success('Vendedor atualizado!')
    } else {
      await addVendedor(formData, avatarFile || undefined)
      success('Vendedor criado!')
    }
    isVendedorModalOpen.value = false
  } catch (err) { error('Erro ao salvar vendedor.') }
}

const handleDeleteVendedor = async (id: string) => {
  if (await confirm({ title: 'Excluir', message: 'Deseja excluir o vendedor?', type: 'danger' })) {
    await deleteVendedor(id)
    success('Vendedor excluído!')
  }
}
</script>
