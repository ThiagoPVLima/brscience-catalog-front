import { ref, computed, watch } from 'vue'

const carrinho = ref<any[]>([])

const savedCart = localStorage.getItem('brscience_cart')
if (savedCart) {
  try {
    carrinho.value = JSON.parse(savedCart)
  } catch (e) {
    console.error('Erro ao carregar carrinho:', e)
    carrinho.value = []
  }
}

watch(
  carrinho,
  (newCart) => {
    localStorage.setItem('brscience_cart', JSON.stringify(newCart))
  },
  { deep: true }
)

export function useCarrinho() {
  const adicionar = (produto: any) => {
    const itemExistente = carrinho.value.find(
      (item) => item.code === produto.code
    )

    const quantidade = produto.quantity ?? 1

    if (itemExistente) {
      itemExistente.quantity += quantidade
    } else {
      carrinho.value.push({
        ...produto,
        quantity: quantidade
      })
    }
  }


  const remover = (code: string) => {
    carrinho.value = carrinho.value.filter((item) => item.code !== code)
  }

  const alterarQuantidade = (code: string, qtd: number) => {
    const item = carrinho.value.find((i) => i.code === code)
    if (item) {
      if (qtd <= 0) remover(code)
      else item.quantity = qtd
    }
  }

  const total = computed(() => {
    return carrinho.value.reduce((acc, item) => {
      const precoLimpo =
        typeof item.price === 'string'
          ? parseFloat(item.price.replace(',', '.'))
          : item.price

      return acc + precoLimpo * item.quantity
    }, 0)
  })

  const quantidadeTotal = computed(() => {
    return carrinho.value.reduce((acc, item) => acc + item.quantity, 0)
  })

  return {
    carrinho,
    adicionar,
    remover,
    alterarQuantidade,
    total,
    quantidadeTotal
  }
}
