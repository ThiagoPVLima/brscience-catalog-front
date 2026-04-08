<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Banner } from '../../stores/useBanners'
import BaseInput from '../atoms/BaseInput.vue'
import { optimizeImage } from '../../utils/imageOptimizer'

const props = defineProps<{
  isOpen: boolean
  bannerData: Banner | null
}>()

const emit = defineEmits(['close', 'save'])

const form = ref<Omit<Banner, 'id'>>({
  imageUrl: '', // Usaremos este campo principal para a imagem mobile
  title: '',
  link: '',
  order: 0,
  active: true
})

const isDragging = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

const emptyForm = () => ({
  imageUrl: '',
  title: '',
  link: '',
  order: 0,
  active: true
})

watch(() => props.isOpen, (open) => {
  if (!open) return
  imageFile.value = null
  if (props.bannerData) {
    form.value = {
      imageUrl: props.bannerData.imageUrl,
      title: props.bannerData.title,
      link: props.bannerData.link || '',
      order: props.bannerData.order,
      active: props.bannerData.active
    }
    imagePreview.value = props.bannerData.imageUrl as string
  } else {
    form.value = emptyForm()
    imagePreview.value = ''
  }
})

const setFile = async (file: File) => {
  const optimized = await optimizeImage(file, 1600)
  imageFile.value = optimized
  imagePreview.value = URL.createObjectURL(optimized)
}

const handleFileInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) setFile(file)
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  form.value.imageUrl = ''
}

const onDragOver = (e: DragEvent) => { e.preventDefault(); isDragging.value = true }
const onDragLeave = () => { isDragging.value = false }
const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) setFile(file)
}

const handleSave = () => {
  if (form.value.title.trim() && (imageFile.value || imagePreview.value)) {
    const data: any = { ...form.value }
    if (imageFile.value) {
      data.imageUrl = imageFile.value
    }
    emit('save', data)
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div
      class="bg-white dark:bg-[#161a22] w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-[#242a36] max-h-[90vh] flex flex-col">

      <div class="p-6 border-b border-slate-100 dark:border-[#242a36] flex justify-between items-center">
        <h2 class="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
          {{ bannerData ? 'Editar Banner' : 'Novo Banner' }}
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500 transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-5">

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Título do Banner</label>
          <BaseInput v-model="form.title" placeholder="Ex: Promoção de Verão" :show-search-icon="false" />
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">
            Imagem do Banner
            <span class="text-red-500">*</span>
            <span class="text-[9px] font-normal normal-case ml-1 text-slate-400">Recomendado: 800×1000px</span>
          </label>

          <div v-if="!imagePreview"
            class="relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer"
            :class="isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
              : 'border-slate-200 dark:border-[#242a36] hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-[#0f1115]'" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop"
            @click="($refs.fileInput as HTMLInputElement).click()">
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileInput" />
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center pointer-events-none">
              <div class="p-3 rounded-xl mb-3"
                :class="isDragging ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-slate-100 dark:bg-[#1d222b]'">
                <svg class="w-8 h-8" :class="isDragging ? 'text-blue-500' : 'text-slate-400'" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
                {{ isDragging ? 'Solte a imagem aqui' : 'Toque ou arraste a imagem' }}
              </p>
              <p class="text-[9px] text-slate-400 mt-1 uppercase">PNG, JPG, WEBP — Vertical</p>
            </div>
          </div>

          <div v-else
            class="relative rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-500/40 w-fit mx-auto bg-slate-100 dark:bg-black/20">

            <img :src="imagePreview" :alt="form.title" class="block w-full h-auto max-h-[60vh] object-contain" />

            <button @click="clearImage"
              class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow-lg transition-all z-10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Link (opcional)</label>
          <BaseInput :model-value="form.link ?? ''" @update:model-value="val => form.link = val"
            placeholder="https://..." :show-search-icon="false" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Ordem</label>
            <BaseInput :model-value="String(form.order)" @update:model-value="val => form.order = Number(val)"
              type="number" placeholder="0" :show-search-icon="false" />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Status</label>
            <label
              class="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-[#0f1115] border border-slate-200 dark:border-[#242a36] cursor-pointer">
              <input v-model="form.active" type="checkbox"
                class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm font-medium text-slate-700 dark:text-gray-200">Ativo</span>
            </label>
          </div>
        </div>

      </div>

      <div
        class="p-6 bg-slate-50 dark:bg-[#1d222b] border-t border-slate-100 dark:border-[#242a36] flex justify-end gap-3">
        <button @click="$emit('close')"
          class="px-6 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">
          Cancelar
        </button>
        <button @click="handleSave" :disabled="(!imageFile && !imagePreview) || !form.title.trim()"
          class="px-10 py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {{ bannerData ? 'Salvar Alterações' : 'Criar Banner' }}
        </button>
      </div>
    </div>
  </div>
</template>
