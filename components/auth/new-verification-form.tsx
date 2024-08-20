"use client"

import { BeatLoader } from "react-spinners"
import { Button } from "../ui/button"
import Link from "next/link"
import { Card, CardContent } from "../ui/card"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { newVerification } from "@/app/actions/new-verification"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    
    const searchParams = useSearchParams();
    const token = searchParams.get("token")
    const onSubmit = useCallback(() => {
        if (success || error ) return
        if(!token) {
            setError("Missing Token!")
            return
        }

        newVerification(token)
            .then((data) =>{
                if (data.success) {
                    setSuccess(data.success)
                } else {
                    setError(data.error)
                }
            })
            .catch(() => {
                setError("Something went wrong!")
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <Card className="mx-auto max-w-sm">
            <CardContent>
                    <div className="flex flex-col justify-center items-center">
                        <div className="py-4">
                            Confirming your verification
                        </div>
                        <div className="p-4">
                            {!success && !error && (
                                <BeatLoader />
                            )}
                            {success && <FormSuccess message={success} />}
                            {!success && (<FormError message={error}/>)}
                        </div>
                        <Button>
                            <Link href="/sign-in">
                                Back to Login
                            </Link>
                        </Button>
                    </div>
            </CardContent>  
        </Card>
    )
}