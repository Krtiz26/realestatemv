"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"




import { reset } from "@/app/actions/reset"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { ResetSchema } from "@/schemas"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"


export const ResetForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();
    
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            reset(values)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
            })
        })
    }

    return  (
        <Form {...form}>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                    <CardDescription>
                        Forgot your password?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="example@example.com"
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormSuccess message={success}/>
                                <FormError message={error || urlError}/>
                                <Button 
                                    disabled={isPending}
                                    type="submit" 
                                    className="w-full"
                                >
                                    Reset password
                                </Button>
                            </form>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-in" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </Form>
    )
}