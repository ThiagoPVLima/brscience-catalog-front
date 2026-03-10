export type ProductLine =
  | 'Fusion Frizz'
  | 'Amazon Forest'
  | 'Sem Pausa'
  | 'Revita Liss'
  | 'Baldes'

export interface Product {
  name: string
  line: ProductLine
  code: string
  ncm: string
  cest: string
  anvisa: string
  distributorPrice: string
  price: string
  image: string
  imageweb: string
  discountPercentage?: number
  color?: string
}
