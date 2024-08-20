import { redirect } from 'next/navigation';
import { auth } from "@/auth";
import AddPropertyForm from "@/app/components/AddPropertyForm";



export default async function AddPropertyPage() {
    const session = await auth();
    if (!session || !session.user?.id) {
        redirect('/login');
        return null;
    }

    return (
        <div className="p-4">
            <AddPropertyForm />
        </div>
    );
}