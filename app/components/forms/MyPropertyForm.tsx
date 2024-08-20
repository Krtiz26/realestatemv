import { getPropertiesByUserId } from "@/app/actions/property";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function PropertyForm() {
    const session = await auth();

    if (!session?.user?.id) {
        return <p>You need to be signed in to view this page.</p>;
    }

    const properties = await getPropertiesByUserId(session.user.id);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Properties</h1>
            {properties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {properties.map((property) => (
                        <Card key={property.id} className="border p-4 hover:bg-gray-100 transition">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">{property.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {property.images && property.images.length > 0 ? (
                                    <Image
                                        src={property.images[0].url}
                                        alt={property.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-auto object-cover mb-2"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-200 mb-2 flex items-center justify-center text-gray-500">
                                        No Image Available
                                    </div>
                                )}
                                <Link href={`/property/edit-property/${property.id}`}>
                                    <Button className="bg-blue-500 text-white py-2 px-4 rounded mt-2">
                                        Edit Property
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>No properties found.</p>
            )}
        </div>
    );
}
