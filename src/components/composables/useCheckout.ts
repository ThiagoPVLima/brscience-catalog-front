import { useRoute } from 'vue-router'
import { useVendedores } from '../../stores/useVendedores'
import { useCarrinho } from './useCarrinho'

export function useCheckout() {
  const route = useRoute()
  const { carrinho, total } = useCarrinho()
  const { vendedorList } = useVendedores()

  const finalizarPedido = () => {
    if (carrinho.value.length === 0) return alert('Carrinho vazio!')

    let vendedorId = ''
    if (route && route.query && route.query.vendedor) {
      vendedorId = String(route.query.vendedor)
    } else {
      const params = new URLSearchParams(window.location.search)
      vendedorId = params.get('vendedor') || ''
    }

    const vendedor = vendedorList.value.find(v => String(v.id) === vendedorId) || vendedorList.value[0]
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

  return { finalizarPedido }
}
