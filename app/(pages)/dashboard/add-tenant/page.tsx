import AddTenantForm from "@/app/components/forms/addtenant";
import { Card, CardContent } from "@/components/ui/card";

export default function addTenantPage() {

    return (
        <Card>
            <CardContent className="p-4">
                <AddTenantForm />
            </CardContent>
        </Card>
    );
}