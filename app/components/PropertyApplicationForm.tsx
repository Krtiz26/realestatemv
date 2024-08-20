"use client";

import React, { useState } from "react";
import { applyForProperty } from "@/app/actions/property";

const PropertyApplicationForm = () => {
    const [userId, setUserId] = useState("");
    const [propertyId] = useState("");
    const [message, setMessage] = useState("");

    const handleApply = async () => {
        const result = await applyForProperty({ userId, propertyId });
        if (result.error) {
            setMessage(result.error);
        } else if (typeof result.success === "string"){
            setMessage(result.success);
        }
    };

    return (
        <div>
            <h1>Apply for Property</h1>
            <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={handleApply}>Apply</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PropertyApplicationForm;
