'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User, LogOut, LogIn, UserPlus } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { CartBadge } from '@/components/cart-badge'

export function Header() {
  const { data: session } = useSession()
  const [activePath, setActivePath] = useState('/')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    setActivePath(path)
  }, [])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
    { href: '/products', label: 'Products' },
  ]

  return (
    <header className='bg-white shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='flex items-center'>
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
              <div className="relative">
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsOpen(!isOpen)}
                  onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                >
                  <User className="h-5 w-5" />
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          signOut()
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-gray-100 flex items-center space-x-1"
                  onClick={() => setIsOpen(!isOpen)}
                  onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                >
                  <User className="h-5 w-5" />
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/auth/signin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}