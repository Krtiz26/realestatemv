"use server";

import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs"; 
import { z } from "zod";
import { changePasswordSchema } from "@/schemas";
import { Role } from "@prisma/client";

export const updateUserProfile = async (formData: { name: string; email: string; phone: string; image: string }) => {
    try {
      const updatedUser = await db.user.update({
        where: { email: formData.email },
        data: {
          name: formData.name,
          phone: formData.phone,
          image: formData.image, // 
        },
      });
  
      return { success: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: 'Failed to update profile. Please try again.' };
    }
  };

export const changeUserPassword = async (values: z.infer<typeof changePasswordSchema>) => {
    const validatedFields = changePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.format());
        return { error: "Invalid fields!" };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    try {
        const user = await db.user.findUnique({
            where: { email: values.email ?? undefined }, 
        });

        if (!user || !user.password) {
            return { error: "User not found or password is not set!" };
        }

        const isMatch = await compare(currentPassword, user.password || ""); 

        if (!isMatch) {
            return { error: "Current password is incorrect!" };
        }

        const hashedPassword = await hash(newPassword, 10);

        await db.user.update({
            where: { email: user.email ?? undefined },
            data: {
                password: hashedPassword,
            },
        });

        return { success: "Password changed successfully!" };
    } catch (error) {
        console.error("Error changing password:", error);
        return { error: "Error changing password. Please try again." };
    }
};

export async function updateUserRole({ userId, newRole }: { userId: string, newRole: Role }) {
    try {
        if (!Object.values(Role).includes(newRole)) {
            throw new Error('Invalid role');
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        return { success: 'Role updated successfully!', user: updatedUser };
    } catch (error) {
        console.error('Error updating user role:', error);
        return { error: 'Failed to update role. Please try again later.' };
    }
}
