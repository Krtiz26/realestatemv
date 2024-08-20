import { auth } from "@/auth"; 
import ApplyForm from "@/app/components/forms/ApplyForm"; 

interface Params {
    params: {
        id: string;
    };
}

export default async function ApplyPage({ params }: Params) {
    const session = await auth();

    if (!session?.user?.id) {
        return <p>You need to be signed in to apply for this property.</p>;
    }

    const propertyId = params.id;
    const userId = session.user.id;

    return (
        <div>
            <ApplyForm propertyId={propertyId} userId={userId} />
        </div>
    );
}
