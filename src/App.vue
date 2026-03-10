<script setup lang="ts">
import { onMounted } from 'vue'
import ToastNotification from './components/atoms/ToastNotification.vue'
import ConfirmDialog from './components/atoms/ConfirmDialog.vue'
import { useProducts } from './stores/useProducts'
import { useProductLines } from './stores/useProductLines'
import { useBanners } from './stores/useBanners'
import { useVendedores } from './stores/useVendedores'

const { fetchProducts } = useProducts()
const { fetchLines } = useProductLines()
const { fetchBanners } = useBanners()
const { fetchVendedores } = useVendedores()

// Carrega tudo do banco assim que o app inicia
onMounted(async () => {
  await Promise.all([fetchLines(), fetchProducts(), fetchBanners(), fetchVendedores()])
})
</script>

<template>
  <router-view />
  <ToastNotification />
  <ConfirmDialog />
</template>

<style scoped></style>
