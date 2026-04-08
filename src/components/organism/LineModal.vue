<script setup lang="ts">
import { ref, watch } from 'vue'
import { DEFAULT_PRODUCT_IMAGE } from '../../constants/images'
import type { ProductLine } from '../../stores/useProductLines'
import BaseInput from '../atoms/BaseInput.vue'
import { optimizeImage } from '../../utils/imageOptimizer'

const props = defineProps<{
  isOpen: boolean
  lineData: ProductLine | null
}>()

const emit = defineEmits(['close', 'save'])

const form = ref<ProductLine>({
  name: '',
  color: '#6b8cff',
  imageUrl: undefined
})

const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

watch(() => props.lineData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
    imagePreview.value = newVal.imageUrl || null
    selectedFile.value = null
  } else {
    form.value = { name: '', color: '#6b8cff', imageUrl: undefined }
    imagePreview.value = null
    selectedFile.value = null
  }
}, { immediate: true })

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido')
      return
    }

    const optimized = await optimizeImage(file, 800)
    selectedFile.value = optimized
    imagePreview.value = URL.createObjectURL(optimized)
  }
}

const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  form.value.imageUrl = undefined
}

const handleSave = () => {
  if (form.value.name.trim()) {
    emit('save', {
      ...form.value,
      imageFile: selectedFile.value // Passar o arquivo para o componente pai processar
    })
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div
      class="bg-white dark:bg-[#161a22] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-[#242a36] max-h-[90vh] flex flex-col overflow-hidden">

      <div class="p-6 border-b border-slate-100 dark:border-[#242a36] flex justify-between items-center">
        <h2 class="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
          {{ lineData ? 'Editar Linha' : 'Nova Linha' }}
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500 transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-5">
        <!-- Nome e Cor -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Nome da Linha</label>
            <BaseInput v-model="form.name" placeholder="Ex: Linha Premium" :show-search-icon="false" />
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Cor da Linha</label>
            <div class="flex gap-3 items-center">
              <input v-model="form.color" type="color"
                class="w-16 h-12 rounded-xl border-2 border-slate-200 dark:border-[#242a36] cursor-pointer" />
              <BaseInput v-model="form.color" placeholder="#6b8cff" :show-search-icon="false" />
            </div>
          </div>
        </div>

        <!-- Upload de Imagem -->
        <div class="space-y-3">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">
            Imagem da Linha
            <span class="text-slate-500 font-normal lowercase">(opcional)</span>
          </label>

          <div class="border-2 border-dashed border-slate-300 dark:border-[#242a36] rounded-xl p-6 text-center">
            <input type="file" accept="image/*" @change="handleFileSelect" class="hidden" id="line-image-upload" />

            <div v-if="!imagePreview" class="space-y-3">
              <div class="flex justify-center">
                <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <label for="line-image-upload"
                  class="cursor-pointer inline-block px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-700 transition-all">
                  Selecionar Imagem
                </label>
              </div>
              <p class="text-[10px] text-slate-400">PNG, JPG ou WEBP (máx. 2MB)</p>
            </div>

            <div v-else class="space-y-3">
              <div class="relative inline-block">
                <img :src="imagePreview" alt="Preview"
                  class="max-h-40 rounded-lg border border-slate-200 dark:border-[#242a36]" />
                <button @click="removeImage"
                  class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                  type="button">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <label for="line-image-upload"
                  class="cursor-pointer inline-block px-4 py-1.5 border border-slate-300 dark:border-[#242a36] text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-50 dark:hover:bg-[#1d222b] transition-all">
                  Trocar Imagem
                </label>
              </div>
            </div>
          </div>

          <p class="text-[9px] text-slate-400 ml-1">
            💡 A imagem será exibida nos filtros da home e no dashboard
          </p>
        </div>

        <!-- Preview Card -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Preview</label>
          <div class="p-4 rounded-xl border-2 bg-slate-50 dark:bg-[#0f1115]"
            :style="{ borderColor: form.color, backgroundColor: form.color + '10' }">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0"
                :style="{ borderColor: form.color }">
                <img v-if="imagePreview" :src="imagePreview" :alt="form.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-black uppercase"
                  :style="{ backgroundColor: form.color + '30', color: form.color }">
                  {{ form.name ? form.name.substring(0, 2) : '?' }}
                </div>
              </div>
              <div>
                <p class="text-sm font-bold" :style="{ color: form.color }">
                  {{ form.name || 'Nome da Linha' }}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ imagePreview ? 'Com imagem personalizada' : 'Usando iniciais' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-6 bg-slate-50 dark:bg-[#1d222b] border-t border-slate-100 dark:border-[#242a36] flex justify-end gap-3">
        <button @click="$emit('close')"
          class="px-6 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">
          Cancelar
        </button>
        <button @click="handleSave"
          class="px-10 py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">
          {{ lineData ? 'Salvar' : 'Criar Linha' }}
        </button>
      </div>
    </div>
  </div>
</template>
