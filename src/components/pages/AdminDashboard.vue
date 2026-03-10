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
          <button @click="activeTab = 'products'" :class="[
            'px-4 py-3 text-[10px] font-black uppercase transition-all whitespace-nowrap',
            activeTab === 'products'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-400 hover:text-slate-600'
          ]">
            Produtos
          </button>
          <button @click="activeTab = 'lines'" :class="[
            'px-4 py-3 text-[10px] font-black uppercase transition-all whitespace-nowrap',
            activeTab === 'lines'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-slate-400 hover:text-slate-600'
          ]">
            Linhas
          </button>
          <button @click="activeTab = 'banners'" :class="[
            'px-4 py-3 text-[10px] font-black uppercase transition-all whitespace-nowrap',
            activeTab === 'banners'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-400 hover:text-slate-600'
          ]">
            Banners
          </button>
          <button @click="activeTab = 'vendedores'" :class="[
            'px-4 py-3 text-[10px] font-black uppercase transition-all whitespace-nowrap',
            activeTab === 'vendedores'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-600'
          ]">
            Vendedores
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
                    <img :src="product.image || product.imageweb"
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
                <td class="p-4">
                  <div class="flex justify-center gap-2">
                    <button @click="openProductModal(product)"
                      class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar">✏️</button>
                    <button @click="handleDeleteProduct(product.code)"
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="5" class="p-8 text-center text-slate-500 text-sm">Nenhum produto encontrado.</td>
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
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Cor</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Imagem</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Preview</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="line in productLines" :key="line.name"
                class="hover:bg-slate-50/50 dark:hover:bg-[#1d222b]/30 transition-colors">
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">{{ line.name }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-md border border-slate-200 dark:border-[#242a36]"
                      :style="{ backgroundColor: line.color }"></div>
                    <span class="text-xs font-mono text-slate-500">{{ line.color }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <div class="w-12 h-12 rounded-full overflow-hidden border-2 bg-slate-100 dark:bg-[#0f1115]"
                    :style="{ borderColor: line.color }">
                    <img v-if="line.imageUrl" :src="line.imageUrl" :alt="line.name"
                      class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[9px] font-black uppercase"
                      :style="{ backgroundColor: line.color + '30', color: line.color }">
                      {{ line.name.substring(0, 2) }}
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="items-center gap-2 px-3 py-1.5 rounded-lg inline-block"
                    :style="{ backgroundColor: line.color + '20', color: line.color }">
                    <div class="w-6 h-6 rounded-full overflow-hidden border flex-shrink-0"
                      :style="{ borderColor: line.color }">
                      <img v-if="line.imageUrl" :src="line.imageUrl" :alt="line.name"
                        class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-[7px] font-black"
                        :style="{ backgroundColor: line.color + '30' }">
                        {{ line.name.substring(0, 2) }}
                      </div>
                    </div>
                    <span class="text-xs font-bold">{{ line.name }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex justify-center gap-2">
                    <button @click="openLineModal(line)"
                      class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar">✏️</button>
                    <button @click="handleDeleteLine(line.name)"
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir">🗑️</button>
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
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Ordem</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="banner in sortedBanners" :key="banner.id"
                class="hover:bg-slate-50/50 dark:hover:bg-[#1d222b]/30 transition-colors">
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div class="relative">
                      <img :src="banner.imageUrl" :alt="banner.title"
                        class="w-20 h-12 rounded-lg object-cover bg-slate-100 dark:bg-[#0f1115]" />
                      <span
                        class="absolute bottom-1 left-1 text-[7px] font-black uppercase bg-black/50 text-white px-1 rounded">🖥</span>
                    </div>
                    <div v-if="banner.mobileImageUrl" class="relative">
                      <img :src="banner.mobileImageUrl" :alt="banner.title + ' mobile'"
                        class="w-8 h-12 rounded-lg object-cover bg-slate-100 dark:bg-[#0f1115]" />
                      <span
                        class="absolute bottom-1 left-0.5 text-[7px] font-black uppercase bg-black/50 text-white px-0.5 rounded">📱</span>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">{{ banner.title }}</td>
                <td class="p-4">
                  <span class="text-sm font-mono text-slate-500">{{ banner.order }}</span>
                </td>
                <td class="p-4">
                  <span :class="[
                    'px-2 py-1 text-[9px] font-black uppercase rounded-md',
                    banner.active
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  ]">
                    {{ banner.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex justify-center gap-2">
                    <button @click="openBannerModal(banner)"
                      class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar">✏️</button>
                    <button @click="handleDeleteBanner(banner.id)"
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="sortedBanners.length === 0">
                <td colspan="5" class="p-8 text-center text-slate-500 text-sm">Nenhum banner cadastrado.</td>
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
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Link</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="vendedor in vendedorList" :key="vendedor.id"
                class="hover:bg-slate-50/50 dark:hover:bg-[#1d222b]/30 transition-colors">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <img v-if="vendedor.avatar_url" :src="vendedor.avatar_url" :alt="vendedor.nome"
                        class="w-full h-full object-cover" />
                      <span v-else class="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {{ vendedor.nome.slice(0, 2).toUpperCase() }}
                      </span>
                    </div>
                    <span class="text-sm font-bold text-slate-700 dark:text-gray-200">{{ vendedor.nome }}</span>
                  </div>
                </td>
                <td class="p-4 text-xs font-mono text-slate-500">+{{ vendedor.whatsapp }}</td>
                <td class="p-4">
                  <a :href="`https://wa.me/${vendedor.whatsapp}`" target="_blank"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase hover:bg-emerald-100 transition-colors">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Abrir
                  </a>
                </td>
                <td class="p-4">
                  <div class="flex justify-center gap-2">
                    <button @click="openVendedorModal(vendedor)"
                      class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar">✏️</button>
                    <button @click="handleDeleteVendedor(vendedor.id)"
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="vendedorList.length === 0">
                <td colspan="4" class="p-8 text-center text-slate-500 text-sm">Nenhum vendedor cadastrado.</td>
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
import { useBanners } from '../../stores/useBanners'
import { useVendedores, type Vendedor } from '../../stores/useVendedores'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'
import type { Product } from '../../types/products'
import type { Banner } from '../../stores/useBanners'

import BaseInput from '../atoms/BaseInput.vue'
import ThemeToggle from '../atoms/ThemeToggle.vue'
import ScroolToTop from '../atoms/ScroolToTop.vue'
import AdminModal from '../organism/AdminModal.vue'
import LineModal from '../organism/LineModal.vue'
import BannerModal from '../organism/BannerModal.vue'
import VendedorModal from '../organism/VendedorModal.vue'

// Stores
const { productList, addProduct, updateProduct, deleteProduct } = useProducts()
const { productLines, addLine, updateLine, deleteLine, uploadLineImage, deleteLineImage } = useProductLines()
const { banners, addBanner, updateBanner, deleteBanner } = useBanners()
const { vendedorList, addVendedor, updateVendedor, deleteVendedor } = useVendedores()

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
    p.name.toLowerCase().includes(query) ||
    p.code.toLowerCase().includes(query)
  )
})

// Banners ordenados
const sortedBanners = computed(() => {
  return [...banners.value].sort((a: Banner, b: Banner) => a.order - b.order)
})

// ===== UTILITÁRIOS DE RENDERIZAÇÃO =====
const getLineColor = (lineName: string) => {
  const line = productLines.value.find(l => l.name === lineName)
  return line?.color || '#3b82f6' // fallback azul
}

// ===== PRODUTOS =====
const openProductModal = (product?: Product) => {
  selectedProduct.value = product ? { ...product } : null
  isProductModalOpen.value = true
}

const handleSaveProduct = async (formData: Product) => {
  try {
    if (selectedProduct.value) {
      const confirmed = await confirm({
        title: 'Confirmar Alteração',
        message: `Deseja realmente atualizar o produto "${formData.name}"?`,
        type: 'info',
        confirmText: 'Sim, atualizar'
      })

      if (confirmed) {
        await updateProduct(formData, selectedProduct.value.code)
        success('Produto atualizado com sucesso!')
        isProductModalOpen.value = false
      }
    } else {
      await addProduct(formData)
      success('Produto cadastrado com sucesso!')
      isProductModalOpen.value = false
    }
  } catch (err) {
    error('Erro ao salvar produto. Tente novamente.')
  }
}

const handleDeleteProduct = async (code: string) => {
  const product = productList.value.find(p => p.code === code)
  if (!product) return

  const confirmed = await confirm({
    title: 'Excluir Produto',
    message: `Tem certeza que deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`,
    type: 'danger',
    confirmText: 'Sim, excluir',
    cancelText: 'Cancelar'
  })

  if (confirmed) {
    await deleteProduct(code)
    success('Produto excluído com sucesso!')
  }
}

// ===== LINHAS =====
const openLineModal = (line?: ProductLine) => {
  selectedLine.value = line ? { ...line } : null
  isLineModalOpen.value = true
}

const handleSaveLine = async (formData: ProductLine & { imageFile?: File }) => {
  try {
    let imageUrl = formData.imageUrl

    // Se há um novo arquivo, fazer upload
    if (formData.imageFile) {
      imageUrl = await uploadLineImage(formData.imageFile, formData.name)
    }

    const lineData: ProductLine = {
      name: formData.name,
      color: formData.color,
      imageUrl
    }

    if (selectedLine.value) {
      const confirmed = await confirm({
        title: 'Confirmar Alteração',
        message: `Deseja realmente atualizar a linha "${formData.name}"?`,
        type: 'info',
        confirmText: 'Sim, atualizar'
      })

      if (confirmed) {
        // Se mudou a imagem, deletar a antiga
        if (formData.imageFile && selectedLine.value.imageUrl) {
          await deleteLineImage(selectedLine.value.imageUrl)
        }

        await updateLine(selectedLine.value.name, lineData)
        success('Linha atualizada com sucesso!')
        isLineModalOpen.value = false
      }
    } else {
      await addLine(lineData)
      success('Linha criada com sucesso!')
      isLineModalOpen.value = false
    }
  } catch (err: any) {
    console.error('Erro ao salvar linha:', err)
    error(err.message || 'Erro ao salvar linha. Tente novamente.')
  }
}

const handleDeleteLine = async (name: string) => {
  const hasProducts = productList.value.some((p: Product) => p.line === name)

  if (hasProducts) {
    error('Não é possível excluir esta linha pois existem produtos vinculados.')
    return
  }

  const confirmed = await confirm({
    title: 'Excluir Linha',
    message: `Tem certeza que deseja excluir a linha "${name}"? Esta ação não pode ser desfeita.`,
    type: 'danger',
    confirmText: 'Sim, excluir',
    cancelText: 'Cancelar'
  })

  if (confirmed) {
    await deleteLine(name)
    success('Linha excluída com sucesso!')
  }
}

// ===== BANNERS =====
const openBannerModal = (banner?: Banner) => {
  selectedBanner.value = banner ? { ...banner } : null
  isBannerModalOpen.value = true
}

const handleSaveBanner = async (formData: Omit<Banner, 'id'>) => {
  try {
    if (selectedBanner.value) {
      const confirmed = await confirm({
        title: 'Confirmar Alteração',
        message: `Deseja realmente atualizar o banner "${formData.title}"?`,
        type: 'info',
        confirmText: 'Sim, atualizar'
      })

      if (confirmed) {
        await updateBanner(selectedBanner.value.id, formData)
        success('Banner atualizado com sucesso!')
        isBannerModalOpen.value = false
      }
    } else {
      await addBanner(formData)
      success('Banner criado com sucesso!')
      isBannerModalOpen.value = false
    }
  } catch (err) {
    error('Erro ao salvar banner. Tente novamente.')
  }
}

const handleDeleteBanner = async (id: string) => {
  const banner = banners.value.find(b => b.id === id)
  if (!banner) return

  const confirmed = await confirm({
    title: 'Excluir Banner',
    message: `Tem certeza que deseja excluir o banner "${banner.title}"? Esta ação não pode ser desfeita.`,
    type: 'danger',
    confirmText: 'Sim, excluir',
    cancelText: 'Cancelar'
  })

  if (confirmed) {
    await deleteBanner(id)
    success('Banner excluído com sucesso!')
  }
}// ===== VENDEDORES =====
const openVendedorModal = (vendedor?: Vendedor) => {
  selectedVendedor.value = vendedor ? { ...vendedor } : null
  isVendedorModalOpen.value = true
}

const handleSaveVendedor = async (formData: Omit<Vendedor, 'id'>, avatarFile?: File | null) => {
  try {
    if (selectedVendedor.value) {
      const confirmed = await confirm({
        title: 'Confirmar Alteração',
        message: `Deseja realmente atualizar o vendedor "${formData.nome}"?`,
        type: 'info',
        confirmText: 'Sim, atualizar'
      })
      if (confirmed) {
        await updateVendedor(selectedVendedor.value.id, formData, avatarFile || undefined)
        success('Vendedor atualizado com sucesso!')
        isVendedorModalOpen.value = false
      }
    } else {
      await addVendedor(formData, avatarFile || undefined)
      success('Vendedor criado com sucesso!')
      isVendedorModalOpen.value = false
    }
  } catch (err) {
    error('Erro ao salvar vendedor. Tente novamente.')
  }
}

const handleDeleteVendedor = async (id: string) => {
  const vendedor = vendedorList.value.find(v => v.id === id)
  if (!vendedor) return

  const confirmed = await confirm({
    title: 'Excluir Vendedor',
    message: `Tem certeza que deseja excluir "${vendedor.nome}"? Esta ação não pode ser desfeita.`,
    type: 'danger',
    confirmText: 'Sim, excluir',
    cancelText: 'Cancelar'
  })

  if (confirmed) {
    await deleteVendedor(id)
    success('Vendedor excluído com sucesso!')
  }
}
</script>
