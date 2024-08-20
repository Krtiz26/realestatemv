"use client";

import React, { useState, useEffect } from "react";
import { getTenantById } from "@/app/actions/property";
import { Tenant } from "@/app/types/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TenantDashboard = () => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchTenantData = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }
    
            console.log("Session User ID:", session.user.id);
    
            try {
                const fetchedTenant = await getTenantById(session.user.id);
                console.log("Fetched Tenant Data:", fetchedTenant);
                setTenant(fetchedTenant as Tenant);
            } catch (error) {
                console.error("Error fetching tenant data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTenantData();
    }, [session]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!tenant || !tenant.property) {
        return <p>No tenant information found.</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Tenant Dashboard</h1>
            
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <h2 className="text-xl"><strong>Property Name: </strong>{tenant.property.name}</h2>
                    </div>
                    {tenant.user?.image && (
                        <div className="mb-4">
                            <Image
                                src={tenant.user.image}
                                alt="Profile Picture"
                                width={64}
                                height={64}
                                className="rounded-full"
                            />
                        </div>
                    )}
                    <div className="mb-2">
                        <p><strong>Property Address: </strong>{tenant.property.address}</p>
                    </div>
                    <div className="mb-2">
                        <p><strong>Rent: </strong>${tenant.property.price} per month</p>
                    </div>
                    <div className="mb-2">
                        <p><strong>Rooms: </strong>{tenant.property.rooms}</p>
                    </div>
                    <div className="mb-2">
                        <p><strong>Bathrooms: </strong>{tenant.property.bathrooms}</p>
                    </div>
                    <div className="mb-2">
                        <p><strong>Rental Type: </strong>{tenant.property.rentalType}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Your Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    {tenant.user.documents && tenant.user.documents.length > 0 ? (
                        <ul>
                            {tenant.user.documents.map((doc) => (
                                <li key={doc.id}>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                        {doc.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No documents uploaded.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TenantDashboard;
