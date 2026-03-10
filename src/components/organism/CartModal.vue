<script setup lang="ts">
import { useCarrinho } from '../composables/useCarrinho'
import { useCheckout } from '../composables/useCheckout'

defineProps<{ isOpen: boolean }>()
defineEmits(['close'])

const { carrinho, alterarQuantidade, remover, total } = useCarrinho()
const { finalizarPedido } = useCheckout()
</script>

<template>
  <div class="fixed inset-0 z-50 pointer-events-none">
    <transition name="backdrop">
      <div v-if="isOpen" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
        @click="$emit('close')"></div>
    </transition>

    <transition name="cart">
      <div v-if="isOpen"
        class="absolute right-0 top-0 h-full w-[85%] sm:max-w-md bg-white dark:bg-[#0f1115] border-l border-slate-200 dark:border-[#242a36] shadow-2xl flex flex-col p-5 pointer-events-auto">
        <div class="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-[#242a36] pb-4">
          <h2 class="font-bold tracking-tight text-slate-900 dark:text-gray-200">MEU CARRINHO</h2>
          <button @click="$emit('close')" class="text-2xl text-slate-400 hover:text-slate-900">&times;</button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2">
          <div v-if="carrinho.length === 0"
            class="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic">
            Seu carrinho está vazio 😔
          </div>
          <div v-else class="space-y-4">
            <div v-for="item in carrinho" :key="item.code"
              class="flex gap-4 border-b border-slate-50 dark:border-[#242a36] pb-4">
              <img :src="item.imageweb" class="w-14 h-14 object-cover rounded bg-slate-50 dark:bg-[#0b0d11] p-1" />
              <div class="flex-1 text-xs">
                <p class="font-bold text-slate-800 dark:text-gray-200 uppercase">{{ item.name }}</p>
                <p class="text-slate-500 font-medium mt-1 text-sm">R$ {{ item.price }}</p>
                <div class="flex items-center gap-3 mt-3">
                  <div class="flex items-center bg-slate-100 dark:bg-[#1a1f2b] rounded-lg">
                    <button @click="alterarQuantidade(item.code, item.quantity - 1)"
                      class="px-3 py-1 text-slate-600 dark:text-gray-200">-</button>
                    <span class="font-bold min-w-[20px] text-center">{{ item.quantity }}</span>
                    <button @click="alterarQuantidade(item.code, item.quantity + 1)"
                      class="px-3 py-1 text-slate-600 dark:text-gray-200">+</button>
                  </div>
                  <button @click="remover(item.code)"
                    class="ml-auto text-red-500 font-bold uppercase text-[10px] hover:underline">Remover</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100 dark:border-[#242a36] pt-6 mt-4">
          <div class="flex justify-between items-center mb-6">
            <span class="text-slate-500 font-medium">Subtotal</span>
            <span class="text-xl font-bold text-slate-900 dark:text-gray-200">R$ {{ total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            }) }}</span>
          </div>
          <button @click="finalizarPedido" :disabled="carrinho.length === 0"
            :class="['w-full py-4 rounded-xl font-black uppercase transition-all shadow-md',
              carrinho.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95']">
            {{ carrinho.length === 0 ? 'Carrinho Vazio' : 'Finalizar Pedido' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.4s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.cart-enter-active,
.cart-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-enter-from,
.cart-leave-to {
  transform: translateX(100%);
}
</style>
