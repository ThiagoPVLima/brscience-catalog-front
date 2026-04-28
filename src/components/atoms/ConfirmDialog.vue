<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConfirm } from '../../composables/useConfirm'

const { dialogData, isDialogOpen, close } = useConfirm()

const confirming = ref(false)

watch(isDialogOpen, (val) => { if (!val) confirming.value = false })

const getTypeColors = (type?: string) => {
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }
  return colors[type as keyof typeof colors] || colors.warning
}

const handleConfirm = () => {
  if (confirming.value) return
  confirming.value = true
  if (dialogData.value?.onConfirm) {
    dialogData.value.onConfirm()
  }
}

const handleCancel = () => {
  if (dialogData.value?.onCancel) {
    dialogData.value.onCancel()
  } else {
    close()
  }
}
</script>

<template>
  <Transition name="dialog">
    <div
      v-if="isDialogOpen && dialogData"
      class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="handleCancel"
    >
      <div
        class="bg-white dark:bg-[#161a22] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#242a36] overflow-hidden"
      >
        <!-- Header -->
        <div class="p-6 border-b border-slate-100 dark:border-[#242a36]">
          <h3 class="text-lg font-black uppercase tracking-wide text-slate-800 dark:text-white">
            {{ dialogData.title }}
          </h3>
        </div>

        <!-- Content -->
        <div class="p-6">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ dialogData.message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="p-6 bg-slate-50 dark:bg-[#1d222b] border-t border-slate-100 dark:border-[#242a36] flex justify-end gap-3">
          <button
            @click="handleCancel"
            class="px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-[#242a36]"
          >
            {{ dialogData.cancelText }}
          </button>
          <button
            @click="handleConfirm"
            :disabled="confirming"
            :class="[
              'px-8 py-2.5 text-white text-[10px] font-black uppercase rounded-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              getTypeColors(dialogData.type)
            ]"
          >
            {{ confirming ? 'Aguarde...' : dialogData.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div,
.dialog-leave-to > div {
  transform: scale(0.95);
}
</style>
