"use client";

import React, { useState } from 'react';
import { updateUserProfile, changeUserPassword } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Widget } from '@uploadcare/react-widget';
import Image from 'next/image';
import { signOut, signIn } from 'next-auth/react';

interface UserProfileFormProps {
  user: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
  };
}

export default function UserProfileForm({ user }: UserProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    image: user.image || '',
  });

  const [passwordData, setPasswordData] = useState({
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUserProfile(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
      await signOut({ redirect: false });
      signIn('credentials', { email: formData.email, redirect: false });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await changeUserPassword(passwordData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
    }
  };

  const handleImageUpload = (fileInfo: any) => {
    setFormData({ ...formData, image: fileInfo.cdnUrl });
  };

  return (
    <div className="w-full">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                type="email"
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-2">Profile Image</label>
              {formData.image && (
                <Image
                  src={formData.image}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="mb-2 w-32 h-32 rounded-full"
                />
              )}
              <Widget publicKey="f99fb59f011decfce509" onChange={handleImageUpload} />
            </div>
            <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Current Password</label>
              <input
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                type="password"
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2">New Password</label>
              <input
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                type="password"
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Confirm New Password</label>
              <input
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                type="password"
                className="border p-2 w-full"
                required
              />
            </div>
            <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
