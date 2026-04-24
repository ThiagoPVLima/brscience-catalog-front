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
            <button @click="handleLogout"
              class="px-4 py-2 text-[10px] font-black border border-red-300 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all">
              SAIR
            </button>
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
              'Vendedores' }}
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
                  <span class="px-2 py-1 text-[9px] font-black uppercase rounded-md"
                    :style="{ backgroundColor: getLineColor(product.line) + '20', color: getLineColor(product.line) }">
                    {{ product.line }}
                  </span>
                </td>
                <td class="p-4 text-xs font-mono text-slate-500">{{ product.code }}</td>
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">R$ {{ product.price }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openProductModal(product)"
                      class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">✏️</button>
                    <button @click="handleDeleteProduct(product)"
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir produto">
                      🗑️
                    </button>
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
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Cor</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Imagem</th>
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
                    <img v-if="line.imageUrl" :src="line.imageUrl as string" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[9px] font-black uppercase"
                      :style="{ backgroundColor: line.color + '30', color: line.color }">
                      {{ line.name.substring(0, 2) }}
                    </div>
                  </div>
                </td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openLineModal(line)"
                      class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">✏️</button>
                    <button @click="handleDeleteLine(line.name)"
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">🗑️</button>
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
                <th class="p-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                <th class="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#242a36]">
              <tr v-for="banner in sortedBanners" :key="banner.id"
                class="hover:bg-slate-50/50 dark:hover:bg-[#1d222b]/30 transition-colors">
                <td class="p-4 text-center">
                  <div class="flex items-center gap-2">
                    <img :src="banner.imageUrl as string"
                      class="w-20 h-12 rounded-lg object-cover bg-slate-100 dark:bg-[#0f1115]" />
                    <img v-if="banner.mobileImageUrl" :src="banner.mobileImageUrl as string"
                      class="w-8 h-12 rounded-lg object-cover bg-slate-100 dark:bg-[#0f1115]" />
                  </div>
                </td>
                <td class="p-4 text-sm font-bold text-slate-700 dark:text-gray-200">{{ banner.title }}</td>
                <td class="p-4">
                  <span
                    :class="['px-2 py-1 text-[9px] font-black uppercase rounded-md', banner.active ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500']">
                    {{ banner.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openBannerModal(banner)"
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">✏️</button>
                    <button @click="handleDeleteBanner(banner.id)"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-lg">🗑️</button>
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
              <tr v-for="vendedor in vendedorList" :key="vendedor.id"
                class="hover:bg-slate-50/50 dark:hover:bg-[#1d222b]/30">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl overflow-hidden bg-emerald-100 flex items-center justify-center">
                      <img v-if="vendedor.avatar_url" :src="vendedor.avatar_url as string"
                        class="w-full h-full object-cover" />
                      <span v-else class="text-sm font-black text-emerald-600">{{ vendedor.nome.slice(0,
                        2).toUpperCase() }}</span>
                    </div>
                    <span class="text-sm font-bold text-slate-700 dark:text-gray-200">{{ vendedor.nome }}</span>
                  </div>
                </td>
                <td class="p-4 text-xs font-mono text-slate-500">+{{ vendedor.whatsapp }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openVendedorModal(vendedor)"
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">✏️</button>
                    <button @click="handleDeleteVendedor(vendedor.id)"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-lg">🗑️</button>
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
import { useRouter } from 'vue-router'
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

// Stores desestruturadas corretamente
const { productList, addProduct, updateProduct, deleteProduct } = useProducts()
const linesStore = useProductLines()
const { banners, addBanner, updateBanner, deleteBanner } = useBanners()
const { vendedorList, addVendedor, updateVendedor, deleteVendedor } = useVendedores()

const { success, error } = useToast()
const { confirm } = useConfirm()
const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('auth_token')
  router.push('/login')
}

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

// Computed Corrigidos
const productLines = computed(() => {
  return (linesStore as any).productLines?.value || []
})

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return query
    ? productList.value.filter((p: Product) =>
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query)
    )
    : productList.value
})

const sortedBanners = computed(() => [...banners.value].sort((a, b) => a.order - b.order))

const getLineColor = (lineName: string) => {
  const lines = (linesStore as any).productLines?.value || []
  return lines.find((l: any) => l.name === lineName)?.color || '#3b82f6'
}

// Handlers Produtos
const openProductModal = (p?: Product) => {
  selectedProduct.value = p ? { ...p } : null
  isProductModalOpen.value = true
}

const handleSaveProduct = async (f: Product) => {
  try {
    if (selectedProduct.value) {
      if (await confirm({ title: 'Confirmar', message: `Atualizar ${f.name}?` })) {
        await updateProduct(f, selectedProduct.value.id)
        success('Atualizado!')
        isProductModalOpen.value = false
      }
    } else {
      await addProduct(f)
      success('Salvo!')
      isProductModalOpen.value = false
    }
  } catch (err: any) {
    error(err.message || 'Erro ao salvar.')
  }
}

const handleDeleteProduct = async (p: Product) => {
  if (await confirm({ title: 'Excluir', message: `Deseja excluir ${p.name}?`, type: 'danger' })) {
    try {
      await deleteProduct(p.id)
      success('Excluído!')
    } catch (err: any) {
      error(err.message)
    }
  }
}

// Handlers Linhas
const openLineModal = (l?: ProductLine) => {
  selectedLine.value = l ? { ...l } : null
  isLineModalOpen.value = true
}

const handleSaveLine = async (f: any) => {
  try {
    const imageFile = f.imageFile instanceof File ? f.imageFile : undefined
    const data = { name: f.name, color: f.color, imageUrl: f.imageUrl }
    if (selectedLine.value) {
      await linesStore.updateLine(selectedLine.value.name, data, imageFile)
    } else {
      await linesStore.addLine(data, imageFile)
    }
    success('Linha salva!')
    isLineModalOpen.value = false
  } catch {
    error('Erro ao salvar linha.')
  }
}

const handleDeleteLine = async (n: string) => {
  if (await confirm({ title: 'Excluir', message: `Excluir linha ${n}?`, type: 'danger' })) {
    try {
      await linesStore.deleteLine(n)
      success('Linha removida!')
    } catch {
      error('Erro ao remover.')
    }
  }
}

// Handlers Banners
const openBannerModal = (b?: Banner) => {
  selectedBanner.value = b ? { ...b } : null
  isBannerModalOpen.value = true
}

const handleSaveBanner = async (f: any) => {
  try {
    selectedBanner.value ? await updateBanner(selectedBanner.value.id, f) : await addBanner(f)
    success('Banner salvo!')
    isBannerModalOpen.value = false
  } catch (err: any) {
    error(err.message || 'Erro ao salvar banner.')
  }
}

const handleDeleteBanner = async (id: string) => {
  if (await confirm({ title: 'Excluir', message: 'Excluir banner?', type: 'danger' })) {
    try {
      await deleteBanner(id)
      success('Banner excluído!')
    } catch {
      error('Erro ao excluir.')
    }
  }
}

// Handlers Vendedores
const openVendedorModal = (v?: Vendedor) => {
  selectedVendedor.value = v ? { ...v } : null
  isVendedorModalOpen.value = true
}

const handleSaveVendedor = async (f: any, file?: File | null) => {
  try {
    if (selectedVendedor.value) {
      await updateVendedor(selectedVendedor.value.id, f, file || undefined)
    } else {
      await addVendedor(f, file || undefined)
    }
    success('Vendedor salvo!')
    isVendedorModalOpen.value = false
  } catch {
    error('Erro ao salvar vendedor.')
  }
}

const handleDeleteVendedor = async (id: string) => {
  if (await confirm({ title: 'Excluir', message: 'Excluir vendedor?', type: 'danger' })) {
    try {
      await deleteVendedor(id)
      success('Vendedor removido!')
    } catch {
      error('Erro ao remover.')
    }
  }
}
</script>
