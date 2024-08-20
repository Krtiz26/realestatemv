"use client";

import React, { useState, useEffect } from "react";
import { getApplicationsByLandlord, getTenantsByLandlord } from "@/app/actions/property";
import { Application, Tenant } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LandlordDashboard = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }
    
            try {
                const fetchedApplications = await getApplicationsByLandlord(session.user.id);
                const fetchedTenants = await getTenantsByLandlord(session.user.id);
                const pendingApplications = fetchedApplications.filter(application => application.status === "PENDING");
    
                setApplications(pendingApplications as Application[]);
                setTenants(fetchedTenants as Tenant[]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchDashboardData();
    }, [session]);    

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Landlord Dashboard</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Your Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Number of Tenants: {tenants.length}</p>
                    <Button onClick={() => router.push("/dashboard/tenants")}>
                        View Tenants
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Number of Applications: {applications.length}</p>
                    <Button onClick={() => router.push("/dashboard/applications")}>
                        View Applications
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default LandlordDashboard;
