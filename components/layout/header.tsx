'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User, LogOut, Menu, LayoutDashboard, ShoppingBag, UserCircle } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CartBadge } from '@/components/cart-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 p-0"
                    onClick={(e) => e.preventDefault()}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 p-0"
                onClick={() => signIn()}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
