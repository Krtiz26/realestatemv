import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required"
    }),
    role: z.enum(["landlord", "tenant"], {
        message: "Account type is required and must be either 'landlord' or 'tenant'"
    })
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
});

export const propertySchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    type: z.enum(["commercial", "house", "apartment"]),
    details: z.string().min(1, "Details are required"),
    price: z.number().int("Price must be an integer"),
    rooms: z.number().min(1, "Number of rooms must be at least 1"),
    bathrooms: z.number().min(1, "Number of bathrooms must be at least 1"),
    rentalType: z.enum(["short_term", "long_term"]),
    kitchen: z.boolean(),
    livingRoom: z.boolean(),
    isRented: z.boolean(),
    images: z.array(z.string()),
    ownerId: z.string().cuid("Invalid user ID"),
});

// Add this export
export const applicationSchema = z.object({
    userId: z.string().cuid("Invalid user ID"),
    propertyId: z.string().cuid("Invalid property ID"),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
});

export const changePasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});