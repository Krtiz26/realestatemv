"use client";

import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { updateUserRole } from '@/app/actions/user';
import { Role } from '@prisma/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';

function Topbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('tenant');

  useEffect(() => {
    if (session?.user?.role) {
      setSelectedRole(session.user.role as Role);
    }
  }, [session]);

  const handleRoleChange = async () => {
    const newRole = selectedRole === 'tenant' ? 'landlord' : 'tenant';
    if (session?.user?.id) {
      const result = await updateUserRole({ userId: session.user.id, newRole });
      if (!result.error) {
        setSelectedRole(newRole);
        window.location.reload(); 
      } else {
        console.error(result.error);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className='fixed top-0 left-0 right-0 h-16 border-b-2 border-gray-200 bg-box px-4 md:px-6 z-50'>
      <div className='flex h-full items-center justify-between'>
        <div className='text-lg items-center font-medium'>
          LOGO
        </div>
        <div className='flex gap-4'>
          {status === 'authenticated' && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{session.user.name || "User"}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push('/user-profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRoleChange}>
                  {selectedRole === 'tenant' ? 'Switch to Landlord' : 'Switch to Tenant'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginButton>
              <Button>
                Sign In
              </Button>
            </LoginButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
