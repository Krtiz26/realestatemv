"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { applicationSchema, propertySchema, RegisterSchema } from "@/schemas"; 
import { Property } from "../types/types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

export const applyForProperty = async (values: z.infer<typeof applicationSchema>) => {
    const validatedFields = applicationSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.format());
        return { error: "Invalid fields!" };
    }

    const { userId, propertyId } = validatedFields.data;

    try {
        const property = await db.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            throw new Error("Property not found");
        }

        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("User not found");
        }

        await db.application.create({
            data: {
                userId,
                propertyId,
            }
        });

        return { success: "Application submitted successfully!" };
    } catch (error) {
        console.error("Error applying for property:", error);
        return { error: "Error applying for property. Please try again." };
    }
};

export const approveApplication = async (applicationId: string) => {
    try {
        const application = await db.application.update({
            where: { id: applicationId },
            data: { status: "APPROVED" },
            include: { user: true, property: true },
        });

        await db.tenant.upsert({
            where: { userId_propertyId: { userId: application.userId, propertyId: application.propertyId } },
            update: {},
            create: {
                userId: application.userId,
                propertyId: application.propertyId,
                status: "Active",  
            },
        });

        return { success: "Application approved successfully!" };
    } catch (error) {
        console.error("Error approving application:", error);
        return { error: "Error approving application. Please try again." };
    }
};

export const rejectApplication = async (applicationId: string) => {
    try {
        await db.application.update({
            where: { id: applicationId },
            data: { status: "REJECTED" },
        });
        return { success: "Application rejected successfully!" };
    } catch (error) {
        console.error("Error rejecting application:", error);
        return { error: "Error rejecting application. Please try again." };
    }
};

export const getApplicationsByLandlord = async (landlordId: string) => {
    try {
        const properties = await db.property.findMany({
            where: { ownerId: landlordId },
            select: { id: true },
        });

        const propertyIds = properties.map(property => property.id);

        return await db.application.findMany({
            where: {
                propertyId: {
                    in: propertyIds,
                },
            },
            include: {
                property: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        image: true,
                        role: true,
                        status: true,       // Add missing fields
                        documents: true,    // Add missing fields
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
};


export const getTenantsByLandlord = async (landlordId: string) => {
    try {
        return await db.tenant.findMany({
            where: {
                property: {
                    ownerId: landlordId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        image: true,
                        role: true,
                        status: true,     
                        documents: true,   
                    },
                },
                property: true,
            },
        });
    } catch (error) {
        console.error("Error fetching tenants:", error);
        return [];
    }
};

export const addTenant = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.format());
        return { error: "Invalid fields!" };
    }

    const { email, password, name, role } = validatedFields.data;

    try {
        await db.user.create({
            data: {
                email,
                password, 
                name,
                role,
            }
        });

        return { success: "Tenant added successfully!" };
    } catch (error) {
        console.error("Error adding tenant:", error);
        return { error: "Error adding tenant. Please try again." };
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

export const getAllProperties = async () => {
    try {
        const properties = await db.property.findMany({
            include: {
                images: true,
            },
        });
        console.log("Fetched properties:", properties);
        return properties;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching properties:", error.message);
            console.error("Stack trace:", error.stack);
        } else {
            console.error("Unexpected error:", error);
        }
        throw new Error("Error fetching properties");
    }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
        const property = await db.property.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });
        return property;
    } catch (error) {
        console.error("Error fetching property:", error);
        return null;
    }
};

export const updateProperty = async (id: string, data: Partial<z.infer<typeof propertySchema>>) => {
    const validatedFields = propertySchema.partial().safeParse(data);

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.format());
        return { error: "Invalid fields!" };
    }

    const { name, address, type, details, price, rooms, bathrooms, rentalType, kitchen, livingRoom, isRented, images } = validatedFields.data;

    try {
        const updatedProperty = await db.property.update({
            where: { id },
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
            }
        });

        if (images) {
            await db.image.deleteMany({
                where: { propertyId: id }
            });

            await Promise.all(
                images.map(async (url) => {
                    await db.image.create({
                        data: {
                            url,
                            propertyId: id,
                        },
                    });
                })
            );
        }

        return { success: "Property updated successfully!" };
    } catch (error) {
        console.error("Error updating property:", error);
        return { error: "Error updating property. Please try again." };
    }
};

export const getPropertiesByUserId = async (userId: string) => {
    try {
        const properties = await db.property.findMany({
            where: { ownerId: userId },
            include: {
                images: true,
            },
        });
        return properties;
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw new Error("Error fetching properties");
    }
};

export const getTenantById = async (tenantId: string) => {
    try {
        const tenant = await db.tenant.findUnique({
            where: { id: tenantId },
            include: {
                user: {
                    include: {
                        documents: true, 
                    },
                },
                property: true,
            },
        });
        return tenant;
    } catch (error) {
        console.error("Error fetching tenant:", error);
        throw new Error("Error fetching tenant details");
    }
};

export async function UploadDocument(formdata: FormData) {
    try {
        const client = new S3Client({
            region: process.env.AWS_REGION,
        });

        const tenantId = formdata.get("tenantId") as string;
        const documentName = formdata.get("documentName") as string;
        const file = formdata.get("file") as File;

        if (!tenantId || !documentName || !file) {
            throw new Error("All fields are required.");
        }

        // Ensure the tenant exists
        const tenant = await db.tenant.findUnique({
            where: { id: tenantId },
            include: { user: true },
        });

        if (!tenant) {
            throw new Error("The provided tenant ID does not exist.");
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileKey = `${nanoid()}-${file.name}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: fileKey,
            Body: buffer,
            ContentType: file.type,  
        };
        const uploadResult = await client.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        const document = await db.document.create({
            data: {
                name: documentName,
                url: fileUrl,
                userId: tenant.userId,
            },
        });

        return { success: true, document };
    } catch (error) {
        console.error("Error uploading document:", error);
        return { success: false, message: "Error uploading document." };
    }
}