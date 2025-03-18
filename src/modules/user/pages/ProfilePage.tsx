import React, {useContext, useEffect, useState} from 'react'
import {useForm, UseFormReturn} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {getUser, updateUser} from "@/core/services/userService";
import {getErrorMessage} from "@/core/utils/errorHandler.ts"
import {AssetResponse, UserUpdateRequest} from '@/core/types/user.ts'
import {Camera, Save, X} from "lucide-react"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {Card} from "@/components/ui/card";
import {UserContext} from "@/contexts/UserContext";
import {AvatarUpdateDialog} from "@/modules/user/components/AvatarUpdateDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";

const FormSchema = z.object({
    firstName: z.string().min(2, {
        message: "First Name must be at least 2 characters.",
    }).max(20, {
        message: "First Name must be under 20 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last Name must be at least 2 characters.",
    }).max(20, {
        message: "Last Name must be under 20 characters.",
    })
});

export default function ProfilePage() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const {user, setUser} = useContext(UserContext);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const {reset} = form;

    // Fetch employee information on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getUser();
                setUser(user);
                reset({
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
            } catch (error) {
                const errorMessage = getErrorMessage(error as Error | string);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        };
        fetchUserData();
    }, [reset]);

    // Handle form submission
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const payload: UserUpdateRequest = {
                firstName: data.firstName,
                lastName: data.lastName,
            };
            setIsProcessing(true);
            const updateUserResponse = await updateUser("mine", payload);
            setIsProcessing(false);
            setUser(updateUserResponse);
            toast({
                title: "Success",
                description: "ProfilePage updated successfully!",
                variant: "default",
            });
        } catch (error) {
            setIsProcessing(false);
            console.error("Error:", error);
            const errorMessage = getErrorMessage(error as Error | string);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    // Handle file change for the profile picture
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const url = URL.createObjectURL(e.target.files[0]);
            setSelectedAvatar(url);
        }
        e.target.value = "";
    };

    const handleUpdateUserAvatar = (asset: AssetResponse | null) => {
        if (asset) {
            setUser({...user, avatar: asset});
        }
        setSelectedAvatar(null);
    };

    return (
        <>
            <PageHeader title='Profile'/>
            <PageContent>
                <Card className="mx-auto p-6 ">
                    <div className="space-y-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <UserAvatar user={user} size={160}/>
                                <div
                                    className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 transition-colors p-3 rounded-full shadow-lg">
                                    <label className="cursor-pointer" htmlFor="upload-photo">
                                        <Camera className="w-5 h-5 text-white"/>
                                    </label>
                                    <input
                                        id="upload-photo"
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            {selectedAvatar && (
                                <AvatarUpdateDialog
                                    initialImageUrl={selectedAvatar}
                                    onChange={handleUpdateUserAvatar}
                                />
                            )}
                        </div>

                        {/* Form Section */}
                        <div className="mt-8">
                            <FullNameField form={form} onSubmit={onSubmit} isProcessing={isProcessing}/>
                        </div>
                    </div>
                </Card>
            </PageContent>
        </>
    )
}


type FieldProps = {
    form: UseFormReturn;
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
    isProcessing: boolean;
}

function FullNameField({form, onSubmit, isProcessing}: FieldProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="First Name"
                                        {...field}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </FormControl>
                                <FormMessage className="text-sm text-red-500"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Last Name"
                                        {...field}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </FormControl>
                                <FormMessage className="text-sm text-red-500"/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={() => form.reset()} type="button" variant="outline"
                            className="mr-2">
                        <X className="w-4 h-4 mr-2"/>
                        Reset
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                        <Save className="w-4 h-4 mr-2"/>
                        {isProcessing ? 'Processing...' : 'Update'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}