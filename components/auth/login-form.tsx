"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { login } from "@/app/actions/login"



import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { LoginSchema } from "@/schemas"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { Social } from "./social"


export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();
    
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            login(values)
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
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                    Enter your email below to login to your account
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
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex pt-4 items-center">
                                                    <FormLabel>Password</FormLabel>
                                                    <Link href="/reset" className="ml-auto inline-block text-sm underline">
                                                        Forgot your password?
                                                    </Link>
                                                </div>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="****"
                                                        type="password"
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
                                    Login
                                </Button>
                            </form>
                        </div>
                        <Social />
                        </div>
                        <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </Form>
    )
}