"use client";

import React, { useState, useEffect } from "react";
import { getApplicationsByLandlord, approveApplication, rejectApplication } from "@/app/actions/property";
import { Application } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ApplicationsForm = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchApplications = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            try {
                const fetchedApplications = await getApplicationsByLandlord(session.user.id);
                const pendingApplications = fetchedApplications.filter(app => app.status === "PENDING");
                setApplications(pendingApplications as Application[]);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [session]);

    const handleApprove = async (applicationId: string) => {
        const result = await approveApplication(applicationId);
        if (result.error) {
            alert(result.error);
        } else {
            setApplications(applications.filter(app => app.id !== applicationId));
            alert(result.success);
        }
    };

    const handleReject = async (applicationId: string) => {
        const result = await rejectApplication(applicationId);
        if (result.error) {
            alert(result.error);
        } else {
            setApplications(applications.filter(app => app.id !== applicationId));
            alert(result.success);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Applications</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <Card key={app.id} className="hover:bg-gray-100 transition">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">{app.user.name} - {app.property.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Status: {app.status}</p>
                                <Button onClick={() => handleApprove(app.id)}>Approve</Button>
                                <Button onClick={() => handleReject(app.id)}>Reject</Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>No applications found.</p>
                )}
            </div>
        </div>
    );
};

export default ApplicationsForm;
