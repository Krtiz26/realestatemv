// app/(pages)/dashboard/page.tsx

"use client"

import LandlordDashboard from "@/app/components/LandlordDashboard";
import TenantDashboard from "@/app/components/TenantDashboard";
import Unauthorized from "@/app/components/Unauthorized";
import { Card } from "@/components/ui/card";
import { useUserRole } from "@/hooks/use-user-role";

const Dashboard = () => {
    const role = useUserRole();

    if (!role) {
        return <Unauthorized />; 
    }

    return (
        <Card className="w-full h-full">
            <div className="p-4">
                {role === "landlord" ? (
                    <LandlordDashboard />
                ) : role === "tenant" ? (
                    <TenantDashboard />
                ) : (
                    <Unauthorized />
                )}
            </div>
        </Card>
    );
};

export default Dashboard;