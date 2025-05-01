'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  )
} 