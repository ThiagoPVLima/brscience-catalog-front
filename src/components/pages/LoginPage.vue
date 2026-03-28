<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300 p-4">

    <router-link to="/"
      class="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      VOLTAR PARA LOJA
    </router-link>

    <div
      class="w-full max-w-md bg-white dark:bg-[#161a22] rounded-2xl shadow-xl border border-slate-200 dark:border-[#242a36] p-8">
      <div class="flex flex-col items-center mb-8">
        <img src="/assets/BRSCIENCE - BRANCO.png" class="h-16 dark:opacity-90 invert dark:invert-0 mb-4" />
        <h1 class="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-gray-100">Painel Admin</h1>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">E-mail de Acesso</label>
          <BaseInput v-model="email" type="email" placeholder="teste@example.com" :show-search-icon="false" />
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Senha</label>
          <BaseInput v-model="password" type="password" placeholder="••••••••" :show-search-icon="false" />
        </div>

        <button type="submit" :disabled="isLoading"
          class="w-full mt-6 py-4 rounded-xl font-black uppercase text-sm transition-all shadow-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50">
          {{ isLoading ? 'Autenticando...' : 'Acessar Sistema' }}
        </button>

        <p v-if="errorMessage" class="text-red-500 text-center text-[11px] font-bold uppercase mt-4">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseInput from '../atoms/BaseInput.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Preencha todos os campos';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = 'Acesso Negado: ' + error.message;
      return;
    }

    if (data.user) {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    }
  } catch (error) {
    errorMessage.value = 'Erro ao conectar com o servidor';
  } finally {
    isLoading.value = false;
  }
};
</script>
