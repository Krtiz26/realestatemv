"use client"

import { logout } from "@/app/actions/logout";
import { useCurrentUser } from "@/hooks/use-currrent-user";
import { signOut } from "next-auth/react";

const SettingsPage = () => {
    const user = useCurrentUser();

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        await logout();
        signOut();
    };

    return (
        <div>
            {JSON.stringify(user)}
            <form>
                <button onClick={onClick} type="button">
                    Sign out
                </button>
            </form>
        </div>
    );
};

export default SettingsPage;
