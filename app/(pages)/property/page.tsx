import PropertiesForm from "@/app/components/PropertyForm";
import { Card, CardContent } from "@/components/ui/card";
import { getAllProperties } from "@/app/actions/property";

export default async function PropertiesPage() {
    const properties = await getAllProperties();

    return (
        <Card className="h-full">
            <PropertiesForm properties={properties} />
        </Card>
    );
}
