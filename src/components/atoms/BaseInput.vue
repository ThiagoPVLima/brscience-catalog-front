<script setup lang="ts">
const props = defineProps<{
  modelValue: string,
  placeholder?: string,
  type?: string,
  showSearchIcon?: boolean
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target) emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative w-full">
    <span v-if="showSearchIcon" class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    </span>

    <input :type="type || 'text'" :value="modelValue" @input="handleInput"
      :placeholder="placeholder || 'Digite aqui...'" :class="[
        'w-full pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-[#0f1115] text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-[#242a36] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all',
        showSearchIcon ? 'pl-10' : 'pl-4'
      ]" />
  </div>
</template>
