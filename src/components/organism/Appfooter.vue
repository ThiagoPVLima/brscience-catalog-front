<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="w-full mt-16 border-t border-slate-200 dark:border-[#242a36] bg-white dark:bg-[#0f1115] transition-colors duration-300">

    <!-- Linha decorativa top -->
    <div class="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

    <div class="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">

      <!-- Logo + tagline -->
      <div class="flex flex-col items-center sm:items-start gap-3">
        <img src="/assets/BRSCIENCE - BRANCO.png" alt="BRSCIENCE" class="h-7 invert dark:invert-0 opacity-80" />
        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
          Ciência &amp; Beleza
        </p>
      </div>

      <!-- Divider vertical (só desktop) -->
      <div class="hidden sm:block h-12 w-px bg-slate-200 dark:bg-[#242a36]" />

      <!-- Créditos + GitHub -->
      <div class="flex flex-col items-center gap-3">
        <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">
          Desenvolvido por
        </p>
        <a href="https://github.com/ThiagoPVLima" target="_blank" rel="noopener noreferrer"
          class="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#242a36] bg-slate-50 dark:bg-[#161a22] hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all duration-300">
          <!-- GitHub Icon -->
          <svg
            class="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors duration-300"
            viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          <span
            class="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            ThiagoPVLima
          </span>
          <!-- Arrow icon -->
          <svg
            class="w-3 h-3 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>

      <!-- Divider vertical (só desktop) -->
      <div class="hidden sm:block h-12 w-px bg-slate-200 dark:bg-[#242a36]" />

      <!-- Copyright -->
      <div class="flex flex-col items-center sm:items-end gap-1.5">
        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
          © {{ year }} BRSCIENCE
        </p>
        <p class="text-[8px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">
          Todos os direitos reservados
        </p>
      </div>

    </div>

    <!-- Linha decorativa bottom -->
    <div class="h-px w-full bg-gradient-to-r from-transparent via-slate-300/30 dark:via-white/5 to-transparent" />

  </footer>
</template>
