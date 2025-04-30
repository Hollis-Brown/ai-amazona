export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  categoryId: string
  stock: number
  createdAt: Date
  updatedAt: Date
  courseDates: string
  courseLength: string
  courseTime: string
  category?: {
    id: string
    name: string
    description?: string | null
    image?: string | null
  }
}

export interface Order {
  id: string
  userId: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  addressLine1: string
  addressLine2: string | null
  fullName: string
} 