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