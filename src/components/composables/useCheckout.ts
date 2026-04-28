import { useRoute } from 'vue-router'
import { useVendedores } from '../../stores/useVendedores'
import { useCarrinho } from './useCarrinho'

const STORE_URL = 'http://86.48.23.217:8098'

export function useCheckout() {
  const route = useRoute()
  const { carrinho, total } = useCarrinho()
  const { vendedorList } = useVendedores()

  const finalizarPedido = () => {
    if (carrinho.value.length === 0) return alert('Carrinho vazio!')

    let vendedorNome = ''
    if (route && route.query && route.query.vendedor) {
      vendedorNome = String(route.query.vendedor)
    } else {
      const params = new URLSearchParams(window.location.search)
      vendedorNome = params.get('vendedor') || ''
    }

    const vendedor = vendedorList.value.find(
      v => v.nome.toLowerCase() === vendedorNome.toLowerCase()
    ) || vendedorList.value[0]

    if (!vendedor) return alert('Nenhum vendedor cadastrado.')

    let mensagem = `Olá, gostaria de confirmar meu pedido:\n\n`

    carrinho.value.forEach(item => {
      mensagem += `${item.quantity}x ${item.name} - R$ ${item.price}\n`
    })

    const valorTotal = typeof total.value === 'number' ? total.value : 0
    mensagem += `\n*Total: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*`

    const link = `https://wa.me/${vendedor.whatsapp}?text=${encodeURIComponent(mensagem)}`
    window.open(link, '_blank')

    carrinho.value = []
    localStorage.removeItem('carrinho')
  }

  const getLinkVendedor = (nome: string) => {
    return `${STORE_URL}/?vendedor=${nome.toLowerCase()}`
  }

  return { finalizarPedido, getLinkVendedor }
}