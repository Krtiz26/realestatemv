"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface PropertiesFormProps {
    properties: Property[];
}

export default function PropertiesForm({ properties }: PropertiesFormProps) {
    const { data: session } = useSession();
    const isLandlord = session?.user?.role === "landlord";

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Properties</h1>
            <div className="mb-4">
                {isLandlord && (
                    <Button>
                        <Link href="/property/add-property" >
                            Add New Property
                        </Link>
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {properties.map((property) => (
                    <Link href={`/property/${property.id}`} key={property.id} passHref>
                        <Card className="border p-4 hover:bg-gray-100 transition">
                            <div className="mb-2">
                                {property.images && property.images.length > 0 ? (
                                    <Image
                                        src={property.images[0].url}  
                                        alt={property.name}
                                        width={200}
                                        height={150}
                                        className="w-full h-auto object-cover mb-2"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-200 mb-2 flex items-center justify-center text-gray-500">
                                        No Image Available
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold">{property.name}</h2>
                                <p className="text-gray-600">${property.price}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
