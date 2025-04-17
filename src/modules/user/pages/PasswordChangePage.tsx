import React, {useContext, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useForm, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {ChangePasswordRequest} from "@/core/types/user.ts";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import {Save, X} from "lucide-react";
import {useUpdateUserPassword} from "@/core/stores/userStore.ts";
import {UserContext} from "@/contexts/UserContext.tsx";

const FormSchema = z
    .object({
        password: z.string().min(8, {message: "Current Password is must be over 8 characters, please try again",}),
        newPassword: z.string().min(8, {message: "Password must be at least 8 characters.",}),
        confirmNewPassword: z.string().min(8, {message: "Password must be at least 8 characters.",})
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match.",
        path: ["confirmNewPassword"],
    });

export default function PasswordChangePage() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const {user} = useContext(UserContext);
    const goBack = () => {
        navigate("/settings");
    };
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const updateUserPasswordMutation = useUpdateUserPassword(user.id);

    const {handleSubmit} = form;

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload: ChangePasswordRequest = {
            currentPassword: data.password,
            newPassword: data.newPassword,
        };

        setIsProcessing(true);

        updateUserPasswordMutation.mutate(
            payload,
            {
                onSuccess: () => {
                    toast({ title: "Success", description: "Password updated successfully!" });
                    navigate('/settings');
                },
                onError: (error) => {
                    const message = getErrorMessage(error);
                    toast({ title: "Error", description: message, variant: "destructive" });
                },
                onSettled: () => {
                    setIsProcessing(false);
                }
            }
        );
    };

    return (
        <>
            <PageHeader backButton='/settings' title='Change Password'></PageHeader>

            <PageContent>
                <Card className="mx-auto p-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <PasswordInputField form={form} name="password" label="Current Password"
                                                placeholder="Enter current password"/>
                            <PasswordInputField form={form} name="newPassword" label="New Password"
                                                placeholder="Enter new password"/>
                            <PasswordInputField form={form} name="confirmNewPassword" label="Confirm New Password"
                                                placeholder="Re-enter new password"/>
                            <div className='flex justify-between pt-4'>
                                <Link to={"/forget-password"} target={"_blank"}
                                        className="text-sm font-semibold p-0 text-primary hover:underline">
                                    Forgot your password?
                                </Link>
                                <div className="flex">
                                    <Button onClick={goBack} type="button" variant="outline" className="mr-2">
                                        <X className="w-4 h-4 mr-2"/>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isProcessing}>
                                        <Save className="w-4 h-4 mr-2"/>
                                        {isProcessing ? 'Processing...' : 'Save'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </Card>
            </PageContent>
        </>
    );
}

type PasswordInputFieldProps = {
    form: UseFormReturn;
    name: string;
    label: string;
    placeholder: string;
};

function PasswordInputField({form, name, label, placeholder}: PasswordInputFieldProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type="password"
                            {...field}
                            onBlur={() => {
                                if (name === "confirmNewPassword") {
                                    form.trigger("confirmNewPassword")
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}