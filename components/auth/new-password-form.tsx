"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"




import { newPassword } from "@/app/actions/new-password"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { NewPasswordSchema } from "@/schemas"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"


export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token")

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();
    
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            newPassword(values, token)
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
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder=""
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormSuccess message={success}/>
                                <FormError message={error}/>
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