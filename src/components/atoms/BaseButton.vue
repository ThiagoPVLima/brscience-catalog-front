<template>
  <button type="button" :class="[
    'px-4 py-1 rounded-3xl cursor-pointer',
    variant === 'primary'
      ? 'bg-blue-500 text-white'
      : 'bg-gray-200 text-gray-900'
  ]" @click="emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

defineProps<{
  variant?: 'primary' | 'secondary'
}>()
</script>
