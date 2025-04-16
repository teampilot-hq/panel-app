import React, {useContext, useState} from "react";
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {UserContext} from "~/contexts/UserContext.tsx";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {LoginRequest} from "@/core/types/authentication.ts";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Eye, EyeOff, Lock, LogIn, Mail} from 'lucide-react';
import Logo from "@/components/icon/Logo.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSignin} from "@/core/stores/authStore.ts";

const FormSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
});

export default function SignInPage() {
    const {authenticate} = useContext(UserContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentURL = searchParams.get('redirect');
    const [showPassword, setShowPassword] = useState(false);

    const signinMutation = useSignin();

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload: LoginRequest = {
            email: data.email,
            password: data.password,
        };

        signinMutation.mutate(payload, {
            onSuccess: (response) => {
                authenticate(response.accessToken);
                navigate(currentURL || "/");
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: getErrorMessage(error),
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9f9] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="">
                        <Logo className="h-12 w-12 text-primary"/>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 text-center max-w-sm">
                        Sign in to your account to continue where you left off
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                                    <Input
                                                        className="pl-10"
                                                        placeholder="name@example.com"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                                    <Input
                                                        className="pl-10"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4"/>
                                                        ) : (
                                                            <Eye className="h-4 w-4"/>
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <Button onClick={() => navigate('/forget-password')} variant="link"
                                            className="text-sm p-0">
                                        Forgot your password?
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                >
                                    <LogIn className="mr-2 h-4 w-4"/>
                                    Sign in
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <Separator/>

                    <CardFooter>
                        <p className="text-sm text-center w-full text-gray-500 mt-4">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-primary hover:underline"
                            >
                                Create one now
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}