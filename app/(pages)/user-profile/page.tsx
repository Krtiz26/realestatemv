"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import UserProfileForm from '@/app/components/forms/UserProfileForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function UserProfilePage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <p>Loading...</p>; 
    }

    if (!session) {
        redirect('/sign-in'); 
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    {session && (
                        <UserProfileForm user={session.user} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
