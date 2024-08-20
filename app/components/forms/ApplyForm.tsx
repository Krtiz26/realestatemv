"use client";

import React, { useState } from "react";
import { applyForProperty } from "@/app/actions/property"; 

interface ApplyFormProps {
    propertyId: string;
    userId: string;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ propertyId, userId }) => {
    const [message, setMessage] = useState("");

    const handleApply = async () => {
        const result = await applyForProperty({ userId, propertyId });
        if (result.error) {
            setMessage(result.error);
        } else {
            setMessage("Application submitted successfully!");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Apply for Property</h2>
            <button
                onClick={handleApply}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Apply
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ApplyForm;
