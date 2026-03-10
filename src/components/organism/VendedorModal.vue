<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Vendedor } from '../../stores/useVendedores'
import BaseInput from '../atoms/BaseInput.vue'

const props = defineProps<{
  isOpen: boolean
  vendedorData: Vendedor | null
}>()

const emit = defineEmits(['close', 'save'])

const form = ref({ nome: '', whatsapp: '', avatar_url: '' })
const avatarFile = ref<File | null>(null)
const isDragging = ref(false)
const previewUrl = ref('')

const emptyForm = () => ({ nome: '', whatsapp: '', avatar_url: '' })

watch(() => props.isOpen, (open) => {
  if (!open) return
  avatarFile.value = null
  if (props.vendedorData) {
    form.value = {
      nome: props.vendedorData.nome,
      whatsapp: props.vendedorData.whatsapp,
      avatar_url: props.vendedorData.avatar_url || ''
    }
    previewUrl.value = props.vendedorData.avatar_url || ''
  } else {
    form.value = emptyForm()
    previewUrl.value = ''
  }
})

// Formata o WhatsApp: só números
const formatWhatsApp = (val: string) => {
  form.value.whatsapp = val.replace(/\D/g, '')
}

// Preview local do arquivo antes do upload
const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) return
  avatarFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const handleFileInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

const onDragOver = (e: DragEvent) => { e.preventDefault(); isDragging.value = true }
const onDragLeave = () => { isDragging.value = false }
const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) processFile(file)
}

const removeAvatar = () => {
  avatarFile.value = null
  previewUrl.value = ''
  form.value.avatar_url = ''
}

const handleSave = () => {
  if (!form.value.nome.trim() || !form.value.whatsapp.trim()) return
  emit('save', { ...form.value }, avatarFile.value)
}

// Iniciais para o avatar placeholder
const initials = (nome: string) => nome.trim().split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div
      class="bg-white dark:bg-[#161a22] w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-[#242a36] flex flex-col max-h-[90vh]">

      <!-- Header -->
      <div class="p-6 border-b border-slate-100 dark:border-[#242a36] flex justify-between items-center">
        <h2 class="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
          {{ vendedorData ? 'Editar Vendedor' : 'Novo Vendedor' }}
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500 transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5">

        <!-- Avatar Upload -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Foto do Vendedor</label>

          <div v-if="!previewUrl"
            class="relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer"
            :class="isDragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
              : 'border-slate-200 dark:border-[#242a36] hover:border-emerald-400 dark:hover:border-emerald-500 bg-slate-50 dark:bg-[#0f1115]'" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop"
            @click="($refs.avatarInput as HTMLInputElement).click()">
            <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleFileInput" />
            <div class="flex flex-col items-center justify-center py-8 px-4 text-center pointer-events-none">
              <!-- Avatar placeholder com iniciais -->
              <div class="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-xl font-black"
                :class="isDragging ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-slate-100 dark:bg-[#1d222b] text-slate-400'">
                {{ form.nome ? initials(form.nome) : '?' }}
              </div>
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
                {{ isDragging ? 'Solte a foto aqui' : 'Arraste ou clique para enviar' }}
              </p>
              <p class="text-[9px] text-slate-400 mt-1">PNG, JPG, WEBP — Recomendado: quadrada</p>
            </div>
          </div>

          <!-- Preview do avatar -->
          <div v-else class="flex items-center gap-4">
            <div class="relative flex-shrink-0">
              <img :src="previewUrl" alt="Avatar"
                class="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-200 dark:border-emerald-500/40" />
              <button @click="removeAvatar"
                class="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-md transition-all">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400">Foto carregada.</p>
              <button @click="($refs.avatarInput as HTMLInputElement).click()"
                class="mt-1 text-[9px] font-black uppercase text-emerald-500 hover:text-emerald-600 transition-colors">
                Trocar foto
              </button>
              <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleFileInput" />
            </div>
          </div>
        </div>

        <!-- Nome -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">
            Nome <span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="form.nome" placeholder="Ex: João Silva" :show-search-icon="false" />
        </div>

        <!-- WhatsApp -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">
            WhatsApp <span class="text-red-500">*</span>
          </label>
          <BaseInput :model-value="form.whatsapp" @update:model-value="formatWhatsApp" placeholder="5521999999999"
            :show-search-icon="false" />
          <p class="text-[9px] text-slate-400 ml-1">
            Código do país + DDD + número, sem espaços. Ex: <strong>5521999887766</strong>
          </p>
        </div>

        <!-- Preview do link WhatsApp -->
        <div v-if="form.whatsapp"
          class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <p class="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-1">Link gerado</p>
          <p class="text-[10px] text-slate-600 dark:text-slate-300 break-all font-mono">
            wa.me/{{ form.whatsapp }}
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div
        class="p-6 bg-slate-50 dark:bg-[#1d222b] border-t border-slate-100 dark:border-[#242a36] flex justify-end gap-3">
        <button @click="$emit('close')"
          class="px-6 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">
          Cancelar
        </button>
        <button @click="handleSave" :disabled="!form.nome.trim() || !form.whatsapp.trim()"
          class="px-10 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {{ vendedorData ? 'Salvar' : 'Criar Vendedor' }}
        </button>
      </div>
    </div>
  </div>
</template>
