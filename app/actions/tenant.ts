import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { z } from "zod";

export const getTenantsByLandlordId = async (landlordId: string) => {
    try {
        const tenants = await db.user.findMany({
            where: {
                role: 'tenant',
                properties: {
                    some: {
                        ownerId: landlordId,
                    },
                },
            },
            include: {
                documents: true,
                properties: true,
                applications: true, 
            },
        });
        return tenants;
    } catch (error) {
        console.error("Error fetching tenants:", error);
        throw new Error("Error fetching tenants");
    }
};

export const getTenants = async () => {
    try {
        const tenants = await db.user.findMany({
            where: { role: "tenant" },
            include: {
                documents: true,
                properties: true,
            },
        });
        return tenants;
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

    const { email, password, name } = validatedFields.data;

    try {
        await db.user.create({
            data: {
                email,
                password,  
                name,
                role: "tenant",  
            }
        });

        return { success: "Tenant added successfully!" };
    } catch (error) {
        console.error("Error adding tenant:", error);
        return { error: "Error adding tenant. Please try again." };
    }
};
