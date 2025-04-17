import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "~/contexts/UserContext.tsx";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {country} from '@/core/types/country.ts';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {Building2, Eye, EyeOff, Lock, User, UserPlus} from 'lucide-react';
import Logo from "@/components/icon/Logo.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegistrationRequest} from "@/core/types/authentication.ts";
import {useSignup} from "@/core/stores/authStore.ts";

const FormSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    firstName: z.string().min(2, {message: "First name must be at least 2 characters"}),
    lastName: z.string().min(2, {message: "Last name must be at least 2 characters"}),
    organization: z.string().min(2, {message: "Organization name must be at least 2 characters"}),
    phone: z.string().optional(),
    country: z.string().min(1, {message: "Please select your country"}),
});

export default function SignUpPage() {
    const {authenticate} = useContext(UserContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const signupMutation = useSignup();

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            organization: "",
            phone: "",
            country: "",
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const payload: RegistrationRequest = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            organizationName: data.organization,
            phone: data.phone,
            country: data.country,
            timezone: userTimezone,
        };

        signupMutation.mutate(payload, {
            onSuccess: (response) => {
                authenticate(response.accessToken);
                navigate('/');
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
        <div className="min-h-screen bg-[#f9f9f9f9] p-4">
            <div className="max-w-xl mx-auto space-y-8 py-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="">
                        <Logo className="h-12 w-12 text-primary"/>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h1>
                    <p className="text-gray-500 text-center max-w-sm">
                        Join us and start collaborating with your team
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Organization Section */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Building2 className="h-5 w-5"/>
                                        Organization Details
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="organization"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Organization Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter organization name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your country"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {country.map((c) => (
                                                            <SelectItem key={c.code} value={c.code}>
                                                                {c.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator/>

                                {/* Personal Details Section */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <User className="h-5 w-5"/>
                                        Personal Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter first name" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter last name" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Phone Number (Optional)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input placeholder="Enter phone number" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator/>

                                {/* Account Section */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Lock className="h-5 w-5"/>
                                        Account Details
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <Input placeholder="name@example.com" {...field} />
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
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Create a secure password"
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
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                >
                                    <UserPlus className="mr-2 h-4 w-4"/>
                                    Sign Up
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <Separator/>

                    <CardFooter>
                        <p className="text-sm text-center w-full text-gray-500 mt-4">
                            Already have an account?{" "}
                            <Link
                                to="/signin"
                                className="font-medium text-primary hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}