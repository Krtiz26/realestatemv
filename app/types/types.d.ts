export interface Property {
    id: string;
    name: string;
    address: string;
    type: string;
    details: string;
    price: number;
    rooms: number;
    bathrooms: number;
    rentalType: string;
    kitchen: boolean;
    livingRoom: boolean;
    isRented: boolean;
    images?: Image[];
    ownerId: string;
}

export interface Image {
    id: string;
    url: string;
    propertyId: string;
}

export interface PropertyFormData {
    name: string;
    address: string;
    type: string;
    details: string;
    price: number;
    isRented: boolean;
    imageURL: string;
}

export interface Params {
    params: {
        id: string;
    };
}

export interface Document {
    id: string;
    name: string;
    url: string;
    userId: string;
}

export interface Tenant {
    id: string;
    userId: string;
    propertyId: string;
    status: string;
    user: User;
    property: Property;
    documents?: Document[];
}


export interface Application {
    id: string;
    userId: string;
    propertyId: string;
    status: ApplicationStatus;
    user: User;
    property: Property;
}

export enum ApplicationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
    status: string | null;
    role: string;
    documents: Document[]; 
};