"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import {
  Home,
  Package,
} from "lucide-react"
import { useSession } from 'next-auth/react'

const Sidebar = () => {
  const { data: session } = useSession();
  const isTenant = session?.user?.role === "tenant";

  return (
    <div className="h-screen w-60 flex flex-col border-r bg-box py-2">
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start text-sm font-medium px-2 md:px-2 space-y-2">
          <Button className='bg-background hover:bg-primary h-12'>
            <Link
              href={"/dashboard"}
              className="flex items-center gap-3 rounded-lg px-3 py-4 text-muted-foreground transition-all hover:text-background"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button className='bg-background hover:bg-primary h-12'>
            <Link
              href="/property"
              className="flex items-center gap-3 rounded-lg px-3 py-4 text-muted-foreground transition-all hover:text-background"
            >
              <Package className="h-4 w-4" />
              Property
            </Link>
          </Button>
          {session && !isTenant && (
              <Button className='bg-background hover:bg-primary h-12'>
                <Link
                  href="/property/my-property"
                  className="flex items-center gap-3 rounded-lg px-3 py-4 text-muted-foreground transition-all hover:text-background"
                >
                  <Package className="h-4 w-4" />
                  My Property
                </Link>
              </Button>
            )}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar;
