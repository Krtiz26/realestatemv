"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { addProperty } from "@/app/actions/upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploaderMinimal } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import Image from "next/image";

const AddPropertyForm = () => {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [type, setType] = useState<"commercial" | "house" | "apartment">("house");
    const [details, setDetails] = useState("");
    const [price, setPrice] = useState(""); 
    const [rooms, setRooms] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [rentalType, setRentalType] = useState<"short_term" | "long_term">("long_term");
    const [kitchen, setKitchen] = useState(false);
    const [livingRoom, setLivingRoom] = useState(false);
    const [isRented, setIsRented] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [message, setMessage] = useState("");

    const handleImageUpload = (event: any) => {
        const successFiles = event.successEntries || [];
        const uploadedUrls = successFiles
            .map((file: any) => file.cdnUrl)
            .filter((url: string) => !imageUrls.includes(url));
    
        setImageUrls((prev) => [...prev, ...uploadedUrls]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) {
            setMessage("User not authenticated");
            return;
        }

        const result = await addProperty({
            name,
            address,
            type,
            details,
            price: parseInt(price, 10),
            rooms,
            bathrooms,
            rentalType,
            kitchen,
            livingRoom,
            isRented,
            images: imageUrls,
            ownerId: session.user.id,
        });

        if (result.error) {
            setMessage(result.error);
        } else {
            setMessage("Property added successfully!");
            setName("");
            setAddress("");
            setType("house");
            setDetails("");
            setPrice("");
            setRooms(1);
            setBathrooms(1);
            setRentalType("long_term");
            setKitchen(false);
            setLivingRoom(false);
            setIsRented(false);
            setImageUrls([]);
        }
    };

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-2xl font-bold mb-4">Add New Property</CardTitle>
            </CardHeader>
            <CardContent>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label className="block mb-2">Name</Label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Address</Label>
                        <Input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Type</Label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as "commercial" | "house" | "apartment")}
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
                        <Input
                            type="text"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Price</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)} 
                            className="border p-2 w-full"
                            placeholder="Enter the price"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Rooms</Label>
                        <Input
                            type="number"
                            value={rooms}
                            onChange={(e) => setRooms(Number(e.target.value))}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Bathrooms</Label>
                        <Input
                            type="number"
                            value={bathrooms}
                            onChange={(e) => setBathrooms(Number(e.target.value))}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Rental Type</Label>
                        <select
                            value={rentalType}
                            onChange={(e) => setRentalType(e.target.value as "short_term" | "long_term")}
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
                            type="checkbox"
                            checked={kitchen}
                            onChange={(e) => setKitchen(e.target.checked)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Living Room</Label>
                        <input
                            type="checkbox"
                            checked={livingRoom}
                            onChange={(e) => setLivingRoom(e.target.checked)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Is Rented</Label>
                        <input
                            type="checkbox"
                            checked={isRented}
                            onChange={(e) => setIsRented(e.target.checked)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block mb-2">Images</Label>
                        <FileUploaderMinimal
                            pubkey="f99fb59f011decfce509"
                            onChange={handleImageUpload}
                        />
                        <div className="mt-2">
                            {imageUrls.map((url, index) => (
                                <Image
                                    key={index}
                                    src={url}
                                    alt={`image-${index}`}
                                    width={100}
                                    height={100}
                                    className="w-20 h-20 object-cover mr-2 mb-2"
                                />
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Add Property
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddPropertyForm;
