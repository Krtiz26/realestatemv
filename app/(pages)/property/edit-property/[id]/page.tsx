"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPropertyById, updateProperty } from "@/app/actions/property";
import { Property } from "@/app/types/types"; 
import Unauthorized from "@/app/components/Unauthorized";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function EditPropertyPage({ params }: { params: { id: string } }) {
    const [property, setProperty] = useState<Partial<Property>>({
        name: '',
        address: '',
        type: 'house', 
        details: '',
        price: 0,
        rooms: 1,
        bathrooms: 1,
        rentalType: 'long_term',
        kitchen: false,
        livingRoom: false,
        isRented: false,
        images: [], 
    });
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await getPropertyById(params.id);
                if (data) {
                    setProperty(data);
                    setImageUrls(data.images?.map(image => image.url) || []);
                    if (session?.user?.id === data.ownerId) { 
                        setIsOwner(true);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch property:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProperty();
    }, [params.id, session]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImageUrls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setImageUrls((prev) => [...prev, ...newImageUrls]);
        }
    };

    const handleRemoveImage = (url: string) => {
        setImageUrls((prev) => prev.filter((imageUrl) => imageUrl !== url));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setProperty((prev: Partial<Property>) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setProperty((prev: Partial<Property>) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const propertyToUpdate = {
                ...property,
                images: imageUrls,
                type: property.type as "house" | "commercial" | "apartment",
                rentalType: property.rentalType as "short_term" | "long_term",
            };

            await updateProperty(params.id, propertyToUpdate);
            router.push('/properties');
        } catch (error) {
            console.error('Failed to update property:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isOwner) {
        return <Unauthorized />;
    }

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-2xl font-bold mb-4">Edit Property</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label className="block mb-2">Name</Label>
                        <Input
                            name="name"
                            value={property.name || ''}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Address</Label>
                        <Input
                            name="address"
                            value={property.address || ''}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Type</Label>
                        <select
                            name="type"
                            value={property.type || 'house'}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        >
                            <option value="commercial">Commercial</option>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Details</Label>
                        <textarea
                            name="details"
                            value={property.details || ''}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Price</Label>
                        <Input
                            name="price"
                            type="number"
                            value={property.price ?? ''}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            placeholder="Enter the price"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Rooms</Label>
                        <Input
                            name="rooms"
                            type="number"
                            value={property.rooms || ''}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Bathrooms</Label>
                        <Input
                            name="bathrooms"
                            type="number"
                            value={property.bathrooms || ''}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Rental Type</Label>
                        <select
                            name="rentalType"
                            value={property.rentalType || 'long_term'}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        >
                            <option value="short_term">Short Term</option>
                            <option value="long_term">Long Term</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Kitchen</Label>
                        <input
                            name="kitchen"
                            type="checkbox"
                            checked={property.kitchen || false}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Living Room</Label>
                        <input
                            name="livingRoom"
                            type="checkbox"
                            checked={property.livingRoom || false}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Is Rented</Label>
                        <input
                            name="isRented"
                            type="checkbox"
                            checked={property.isRented || false}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Images</Label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                            className="border p-2 w-full"
                        />
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={url}
                                        alt={`image-${index}`}
                                        width={100}
                                        height={100}
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(url)}
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Update Property
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
