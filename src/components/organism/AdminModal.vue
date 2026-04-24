<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useProductLines } from '../../stores/useProductLines';
import type { Product, ProductLine } from '../../types/products';
import BaseInput from '../atoms/BaseInput.vue';
import { optimizeImage } from '../../utils/imageOptimizer';
import { maskNCM, maskCEST, maskANVISA } from '../../utils/masks';

const { productLines } = useProductLines();

const props = defineProps<{
  isOpen: boolean;
  productData: Product | null;
}>();

const emit = defineEmits(['close', 'save']);

const form = ref<Product>({
  name: '',
  line: 'Fusion Frizz' as ProductLine,
  code: '',
  ncm: '',
  cest: '',
  anvisa: '',
  distributorPrice: '',
  price: '',
  image: '',
  imageweb: '',
  discountPercentage: undefined
});

// Drag state
const isDraggingProduct = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string>('');

watch(() => props.isOpen, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, { immediate: true });

onUnmounted(() => {
  document.body.style.overflow = '';
});

watch(() => props.productData, (newVal) => {
  imageFile.value = null;
  if (newVal) {
    form.value = {
      ...newVal,
      ncm: maskNCM(newVal.ncm || ''),
      cest: maskCEST(newVal.cest || ''),
      anvisa: maskANVISA(newVal.anvisa || '')
    };
    imagePreview.value = (newVal.imageweb || newVal.image) as string;
  } else {
    form.value = {
      name: '', line: 'Fusion Frizz' as ProductLine, code: '', ncm: '', cest: '',
      anvisa: '', distributorPrice: '', price: '', image: '', imageweb: '',
      discountPercentage: undefined
    };
    imagePreview.value = '';
  }
}, { immediate: true });

const setImageFile = async (file: File) => {
  const optimized = await optimizeImage(file)
  imageFile.value = optimized;
  imagePreview.value = URL.createObjectURL(optimized);
};

const handleProductImageInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) setImageFile(file);
};

const clearImage = () => {
  imageFile.value = null;
  imagePreview.value = '';
  form.value.imageweb = '';
  form.value.image = '';
};

const onProductDragOver = (e: DragEvent) => { e.preventDefault(); isDraggingProduct.value = true; };
const onProductDragLeave = () => { isDraggingProduct.value = false; };
const onProductDrop = (e: DragEvent) => {
  e.preventDefault();
  isDraggingProduct.value = false;
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) setImageFile(file);
};

const handleSave = () => {
  const data: any = { ...form.value };
  if (imageFile.value) {
    data.imageweb = imageFile.value;
    data.image = imageFile.value;
  }
  emit('save', data);
};
</script>

<template>
  <div v-if="isOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">

    <div
      class="bg-white dark:bg-[#161a22] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-[#242a36] overflow-hidden flex flex-col max-h-[90vh]">

      <div
        class="p-6 border-b border-slate-100 dark:border-[#242a36] flex justify-between items-center bg-white dark:bg-[#161a22] z-10">
        <h2 class="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
          {{ productData ? 'Editar Produto' : 'Novo Cadastro' }}
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500 transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div class="space-y-5">
            <p class="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">Informações
              Principais</p>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Nome do Produto</label>
              <BaseInput v-model="form.name" placeholder="Ex: Kit Fusion Frizz" :show-search-icon="false" />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Linha do Produto</label>
              <select v-model="form.line"
                class="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0f1115] border border-slate-200 dark:border-[#242a36] text-sm focus:outline-none text-slate-700 dark:text-gray-200 appearance-none cursor-pointer">
                <option v-for="line in productLines" :key="line.name" :value="line.name">
                  {{ line.name }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Preço (R$)</label>
                <BaseInput v-model="form.price" placeholder="0,00" :show-search-icon="false" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase text-red-500 ml-1">Desconto (%)</label>
                <BaseInput :model-value="form.discountPercentage != null ? String(form.discountPercentage) : ''"
                  @update:model-value="val => form.discountPercentage = val ? Number(val) : undefined" type="number"
                  placeholder="Ex: 10" :show-search-icon="false" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Código EAN / SKU</label>
              <BaseInput v-model="form.code" placeholder="789..." :show-search-icon="false" />
            </div>
          </div>

          <div class="space-y-5">
            <p class="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">Dados Técnicos e
              Foto</p>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Registro ANVISA</label>
              <BaseInput v-model="form.anvisa" placeholder="0.0000.0000.000-0" :show-search-icon="false" :mask="maskANVISA" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">NCM</label>
                <BaseInput v-model="form.ncm" placeholder="0000.00.00" :show-search-icon="false" :mask="maskNCM" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">CEST</label>
                <BaseInput v-model="form.cest" placeholder="00.000.00" :show-search-icon="false" :mask="maskCEST" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase text-slate-400 ml-1">Foto do Produto</label>

              <!-- Drop Zone -->
              <div v-if="!imagePreview"
                class="relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer"
                :class="isDraggingProduct
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                  : 'border-slate-200 dark:border-[#242a36] hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-[#0f1115]'" @dragover="onProductDragOver" @dragleave="onProductDragLeave"
                @drop="onProductDrop" @click="($refs.productImageInput as HTMLInputElement).click()">
                <input ref="productImageInput" type="file" accept="image/*" class="hidden"
                  @change="handleProductImageInput" />
                <div class="flex flex-col items-center justify-center py-6 px-4 text-center pointer-events-none">
                  <div class="p-3 rounded-xl mb-3"
                    :class="isDraggingProduct ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-slate-100 dark:bg-[#1d222b]'">
                    <svg class="w-7 h-7" :class="isDraggingProduct ? 'text-blue-500' : 'text-slate-400'" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {{ isDraggingProduct ? 'Solte a imagem aqui' : 'Arraste ou clique para enviar' }}
                  </p>
                  <p class="text-[9px] text-slate-400 mt-1">PNG, JPG, WEBP</p>
                </div>
              </div>

              <!-- Preview -->
              <div v-else
                class="relative rounded-2xl border-2 border-blue-200 dark:border-blue-500/40 bg-slate-50 dark:bg-[#0f1115] overflow-hidden">
                <img :src="imagePreview" class="w-full h-auto object-contain rounded-xl block" />
                <button @click="clearImage"
                  class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow-md transition-all">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-6 bg-slate-50 dark:bg-[#1d222b] border-t border-slate-100 dark:border-[#242a36] flex justify-end gap-3 z-10">
        <button @click="$emit('close')"
          class="px-6 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">
          Cancelar
        </button>
        <button @click="handleSave"
          class="px-10 py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">
          {{ productData ? 'Salvar Alterações' : 'Cadastrar Produto' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
