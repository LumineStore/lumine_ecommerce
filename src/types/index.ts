export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  additionalInfo?: string | null;
  price: number;
  discountPrice?: number;
  categoryId: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderProduct {
  productId: string;
  title: string;
  category: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerLastName: string;
  phone: string;
  email: string;
  department: string;
  province: string;
  district: string;
  address: string;
  addressReference: string;
  addressExtra: string;
  notes: string;
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
  confirmAddress: boolean;
  confirmProducts: boolean;
  createdAt: string;
  updatedAt: string;
  internalObservations?: string;
}

export type OrderStatus =
  | 'No pedido'
  | 'Pedido realizado en Dropi'
  | 'En proceso'
  | 'Enviado'
  | 'Entregado'
  | 'Cancelado'
  | 'Rechazado'
  | 'Devuelto';

export const ORDER_STATUSES: OrderStatus[] = [
  'No pedido',
  'Pedido realizado en Dropi',
  'En proceso',
  'Enviado',
  'Entregado',
  'Cancelado',
  'Rechazado',
  'Devuelto',
];

export const DEPARTMENTS = [
  'Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca',
  'Callao','Cusco','Huancavelica','Huánuco','Ica','Junín',
  'La Libertad','Lambayeque','Lima','Loreto','Madre de Dios',
  'Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali',
];
