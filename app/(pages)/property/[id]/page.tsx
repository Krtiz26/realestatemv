import { getPropertyById } from "@/app/actions/property";
import { Params, Property } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";


export default async function PropertyDetailsPage({ params }: Params) {
    const propertyId = params.id;
    const property: Property | null = await getPropertyById(propertyId);

    if (!property) {
        notFound();
    }

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-2xl font-bold mb-4">{property.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="pl-4">
                    {property.images && property.images.length > 0 && (
                        <Carousel className="w-full max-w-2xl mb-4">
                            <CarouselContent>
                                {property.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-video items-center justify-center p-6">
                                                    <Image
                                                        src={image.url}
                                                        alt={`image-${index}`}
                                                        width={600}
                                                        height={400}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    )}
                </div>
                <p className="mb-2"><strong>Address: </strong>{property.address}</p>
                <p className="mb-2"><strong>Details: </strong>{property.details}</p>
                <p className="mb-2"><strong>Type: </strong>{property.type}</p>
                <p className="mb-2"><strong>Price: </strong>${property.price}</p>
                <p className="mb-2"><strong>Rooms: </strong>{property.rooms}</p>
                <p className="mb-2"><strong>Bathrooms: </strong>{property.bathrooms}</p>
                <p className="mb-2"><strong>Rental Type: </strong>{property.rentalType}</p>
                <p className="mb-2">{property.kitchen ? "Has Kitchen" : "No Kitchen"}</p>
                <p className="mb-2">{property.livingRoom ? "Has Living Room" : "No Living Room"}</p>
                <p className="mb-2">{property.isRented ? "Rented" : "Available"}</p>

                <div className="mt-4">
                    <Link href={`/property/apply/${propertyId}`}>
                        <Button className="bg-blue-500 text-white py-2 px-4 rounded">
                            Apply for Property
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
