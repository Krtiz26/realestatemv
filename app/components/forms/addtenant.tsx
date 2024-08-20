"use client";

import React, { useState, useEffect } from "react";
import { addTenant, getPropertiesByUserId } from "@/app/actions/property"; 
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Property } from "@/app/types/types"; 

const AddTenantForm = () => {
    const { data: session } = useSession(); 
    const [tenantData, setTenantData] = useState({
        name: "",
        email: "",
        phone: "",
        status: "",
        password: "",
        role: "tenant" as "tenant" | "landlord", 
        propertyId: "",
    });

    const [properties, setProperties] = useState<Property[]>([]); 

    useEffect(() => {
        const fetchProperties = async () => {
            if (session?.user?.id) {
                const fetchedProperties = await getPropertiesByUserId(session.user.id);
                setProperties(fetchedProperties);
            }
        };

        fetchProperties();
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTenantData({
            ...tenantData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await addTenant(tenantData);
        if (result.error) {
            alert(result.error);
        } else {
            alert(result.success);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-xl font-bold mb-4">Add New Tenant</h2>
            <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                    name="name"
                    value={tenantData.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                    name="email"
                    value={tenantData.email}
                    onChange={handleChange}
                    type="email"
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input
                    name="phone"
                    value={tenantData.phone}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Property</label>
                <select
                    name="propertyId"
                    value={tenantData.propertyId}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.name}
                        </option>
                    ))}
                </select>
            </div>
            <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Add Tenant
            </Button>
        </form>
    );
};

export default AddTenantForm;
