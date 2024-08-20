import Link from "next/link"
import { Button } from "../ui/button"
import { Card , CardFooter, CardHeader} from "../ui/card"

export const ErrorCard = () => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <div>
                    Somthing Went Wrong
                </div>
            </CardHeader>
            <CardFooter>
                <Button>
                    <Link href="/sign-up">
                        Back to login
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}