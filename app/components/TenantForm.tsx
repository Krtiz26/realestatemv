"use client";

import React, { useState, useEffect } from "react";
import { getTenantsByLandlord } from "@/app/actions/property";
import { Tenant } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const TenantsForm = () => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchTenants = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            try {
                const fetchedTenants = await getTenantsByLandlord(session.user.id);
                setTenants(fetchedTenants as Tenant[]);
            } catch (error) {
                console.error("Error fetching tenants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenants();
    }, [session]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Tenants</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tenants.length > 0 ? (
                    tenants.map((tenant) => (
                        <Card key={tenant.id} className="hover:bg-gray-100 transition cursor-pointer" onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-center">
                                    {tenant.user.name || "No Name Provided"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                {tenant.user.image && (
                                    <div className="mb-2">
                                        <Image
                                            src={tenant.user.image}
                                            alt="Profile Picture"
                                            width={64}
                                            height={64}
                                            className="rounded-full"
                                        />
                                    </div>
                                )}
                                <p className="pt-2">Email: {tenant.user.email || "No Email Provided"}</p>
                                <p>Phone: {tenant.user.phone || "No Phone Provided"}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>No tenants found.</p>
                )}
            </div>
        </div>
    );
};

export default TenantsForm;
