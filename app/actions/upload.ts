"use server";

import { db } from '@/lib/db';
import { propertySchema } from '@/schemas';
import { z } from 'zod';

export const uploadImages = async (files: string[]) => {
    try {
        const fileUrls = files.map(fileUrl => {
            return fileUrl;
        });

        return fileUrls;
    } catch (error) {
        console.error("File upload failed:", error);
        throw new Error("File upload failed");
    }
};

export const addProperty = async (values: z.infer<typeof propertySchema>) => {
    const validatedFields = propertySchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.format());
        return { error: "Invalid fields!" };
    }

    const { name, address, type, details, price, rooms, bathrooms, rentalType, kitchen, livingRoom, isRented, images, ownerId } = validatedFields.data;

    try {
        const property = await db.property.create({
            data: {
                name,
                address,
                type,
                details,
                price,
                rooms,
                bathrooms,
                rentalType,
                kitchen,
                livingRoom,
                isRented,
                ownerId,
            }
        });

        await Promise.all(
            images.map(async (url) => {
                await db.image.create({
                    data: {
                        url,
                        propertyId: property.id,
                    },
                });
            })
        );

        return { success: "Property added successfully!" };
    } catch (error) {
        console.error("Error adding property:", error);
        return { error: "Error adding property. Please try again." };
    }
};
