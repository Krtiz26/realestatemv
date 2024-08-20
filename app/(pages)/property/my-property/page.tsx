import MyPropertyForm from "@/app/components/forms/MyPropertyForm"; 
import { Card, CardContent } from "@/components/ui/card";

export default function MyPropertiesPage() {

    return (
        <Card>
            <CardContent className="p-4">
                <MyPropertyForm />
            </CardContent>
        </Card>
    );
}