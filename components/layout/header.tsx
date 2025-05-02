'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CartBadge } from '@/components/layout/cart-badge'
import { cn } from '@/lib/utils'

export function Header() {
  const { data: session } = useSession()
  const [activePath, setActivePath] = useState('/')

  // Set active path based on current route
  useEffect(() => {
    const path = window.location.pathname
    setActivePath(path)
  }, [])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
    { href: '/products', label: 'Products Catalog' },
  ]

  return (
    <header className='bg-white shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link
              href='/'
              className='flex items-center'
            >
              <Image 
                src='/images/logo.png' 
                alt='AI Amazona Logo' 
                width={320}
                height={80}
                className='w-auto h-24'
                priority
              />
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className='hidden md:flex flex-1 justify-center'>
            <ul className='flex space-x-8'>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-base font-medium transition-colors px-3 py-1 rounded-md',
                      activePath === item.href
                        ? 'text-gray-900 outline outline-2 outline-gray-900'
                        : 'text-gray-700 hover:text-gray-900'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section */}
          <div className='flex items-center gap-4'>
            <CartBadge />
            {/* Mobile menu button */}
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
