'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      // This will hydrate the cart with the persisted data from localStorage
      const savedCart = localStorage.getItem('shopping-cart')
      if (savedCart) {
        try {
          const { state } = JSON.parse(savedCart)
          if (state && state.items) {
            useCartStore.setState({ items: state.items })
          }
        } catch (error) {
          console.error('Error parsing cart data:', error)
          // Reset the cart if there's an error parsing the data
          localStorage.removeItem('shopping-cart')
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    } finally {
      // Always set hydrated to true to prevent the app from being blank
      setIsHydrated(true)
    }
  }, [])

  // Always render children, even if not hydrated
  // This prevents the app from being blank
  return <>{children}</>
}
