'use client'

import Link from 'next/link'
import { Search, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession, signIn, signOut } from 'next-auth/react'
import { CartBadge } from '@/components/layout/cart-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className='border-b'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='text-xl font-bold'>
              AI Amazona
            </Link>
          </div>

          {/* Products Catalog Link */}
          <Link
            href='/products'
            className='ml-6 text-sm font-medium text-gray-700 hover:text-gray-900'
          >
            Products
          </Link>

          {/* Search */}
          <div className='hidden sm:block flex-1 max-w-2xl mx-8'>
            <div className='relative'>
              <Input
                type='search'
                placeholder='Search products...'
                className='w-full pl-10'
              />
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link href='/search'>
                <Search className='h-5 w-5 sm:hidden' />
              </Link>
            </Button>
            <CartBadge />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <User className='h-5 w-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem asChild>
                    <Link href='/dashboard'>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/orders'>My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/profile'>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className='text-red-600'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant='default' onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
