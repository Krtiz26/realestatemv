"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { useState, useTransition } from "react"
import { Social } from "./social"


import { register } from "@/app/actions/register"
import { RegisterSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'



export const SignupForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();
    
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            role: "landlord",
        }
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
            })
        })
    }


  return (
    <Form {...form}>
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid gap-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid gap-2">
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder=""
                                                    type="name"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                </FormItem>
                            )}
                        />
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
                                            placeholder=""
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
                                    <div className="flex pt-2 items-center">
                                        <FormLabel>Password</FormLabel>
                                    </div>
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
                        Create an account
                    </Button>
                </form>
                <div className="pt-4">
                    <Social />
                    <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="underline">
                        Sign in
                    </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    </Form>
  )
}
