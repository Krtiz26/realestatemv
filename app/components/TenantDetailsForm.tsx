"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getTenantById, UploadDocument } from "@/app/actions/property";
import { Tenant } from "@/app/types/types";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TenantDetailsForm = () => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentName, setDocumentName] = useState("");
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const params = useParams();
    const tenantId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const fetchTenantDetails = useCallback(async () => {
        if (!tenantId) {
            setLoading(false);
            return;
        }

        try {
            const data = await getTenantById(tenantId);
            if (data) {
                setTenant({
                    ...data,
                    user: {
                        ...data.user,
                        name: data.user.name || "",
                        email: data.user.email || "", 
                        phone: data.user.phone || "", 
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching tenant details:", error);
        } finally {
            setLoading(false);
        }
    }, [tenantId]);

    useEffect(() => {
        fetchTenantDetails();
    }, [fetchTenantDetails]);

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!documentFile) {
            alert("Please select a file to upload.");
            return;
        }
        
        const formData = new FormData();
        formData.append("tenantId", tenantId || ""); 
        formData.append("documentName", documentName);
        formData.append("file", documentFile);

        try {
            const result = await UploadDocument(formData);
            if (result.success) {
                alert("Document uploaded successfully!");
                fetchTenantDetails(); 
            } else {
                alert(result.message || "Failed to upload document.");
            }
        } catch (error) {
            console.error("Error uploading document:", error);
            alert("Error uploading document.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!tenant || !tenant.user || !tenant.user.documents) {
        return <p>No tenant found.</p>;
    }

    return (
        <div className="p-4 m-4">
            <h1 className="text-2xl font-bold mb-4">Tenant Details</h1>
            <div className="mb-4">
                <h2 className="text-xl"><strong>Name: </strong>{tenant.user?.name || "N/A"}</h2>
            </div>
            {tenant.user?.image && (
                <div className="mb-4">
                    <Image
                        src={tenant.user.image}
                        alt="Profile Picture"
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
                </div>
            )}
            <div className="mb-2">
                <p><strong>Email: </strong>{tenant.user?.email || "N/A"}</p>
            </div>
            <div className="mb-2">
                <p><strong>Phone: </strong>{tenant.user?.phone || "No Phone Provided"}</p>
            </div>
            <div className="mb-2">
                <p><strong>Property: </strong>{tenant.property?.name || "N/A"}</p>
            </div>
            <div className="mt-2">
                <p className="font-semibold mb-2">Upload Agreement Document</p>
                <form onSubmit={handleUpload}>
                    <Input 
                        type="text"
                        placeholder="Document Name"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="mb-2"
                    />
                    <Input 
                        type="file"
                        onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} 
                        className="mb-2"
                    />
                    <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        Upload Document
                    </Button>
                </form>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
                {tenant.user.documents && tenant.user.documents.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Uploaded Date</TableHead>
                                <TableHead>Download Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tenant.user.documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.name}</TableCell>
                                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <a 
                                            href={doc.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            download
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                        >
                                            Download
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>No documents uploaded.</p>
                )}
            </div>
        </div>
    );
};

export default TenantDetailsForm;
