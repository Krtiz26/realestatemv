import { db } from "@/lib/db";

// Function to get a property by ID
export const getPropertyById = async (id: string) => {
    try {
        const property = await db.property.findUnique({ where: { id } });
        return property;
    } catch {
        return null;
    }
}

// Function to get all properties
export const getAllProperties = async () => {
    try {
        const properties = await db.property.findMany();
        return properties;
    } catch {
        return [];
    }
}

// Function to create a new property
export const createProperty = async (data: {
    name: string;
    address: string;
    type: string;
    details: string;
    ownerId: string;
    isRented: boolean;
}) => {
    try {
        const property = await db.property.create({
            data
        });
        return property;
    } catch {
        return null;
    }
}

// Function to update a property
export const updateProperty = async (id: string, data: Partial<{
    name: string;
    address: string;
    type: string;
    details: string;
    isRented: boolean;
}>) => {
    try {
        const property = await db.property.update({
            where: { id },
            data
        });
        return property;
    } catch {
        return null;
    }
}

// Function to delete a property
export const deleteProperty = async (id: string) => {
    try {
        await db.property.delete({ where: { id } });
        return true;
    } catch {
        return false;
    }
}
