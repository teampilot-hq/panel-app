import React, {useContext, useEffect, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {country} from "@/core/types/country.ts";
import {OrganizationUpdateRequest} from "@/core/types/organization.ts";
import {Week} from "@/core/types/enum.ts";
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UserContext} from "@/contexts/UserContext";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import {Save, X} from "lucide-react";
import {useOrganization, useUpdateOrganization} from "@/core/stores/organizationStore.ts";

const FormSchema = z.object({
    name: z.string().min(2, {message: "organization name must be over 2 characters"}).max(20, {message: "organization name must be under 20 characters"}),
    country: z.string().min(1, {message: "Country is required"}),
    weekFirstDay: z.nativeEnum(Week, {errorMap: () => ({message: "Week starting day is required"})}),
    workingDays: z.array(z.nativeEnum(Week)).min(1, {message: "At least one working day is required"}),
});

function getWeekDayName(day: Week): string {
    return day.charAt(0) + day.slice(1).toLowerCase();
}

export default function OrganizationPage() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const {user} = useContext(UserContext);

    const {data: organization} = useOrganization();
    const updateOrganizationMutation = useUpdateOrganization();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            country: "",
            weekFirstDay: Week.MONDAY,
            workingDays: [],
        },
    });

    // Fetch organization and set default values
    useEffect(() => {
        if (organization) {
            const countryName = country.find(c => c.code === organization.country)?.name || "";
            form.reset({
                name: organization.name,
                country: countryName,
                weekFirstDay: organization.weekFirstDay,
                workingDays: organization.workingDays,
            });
        }
    }, [organization]);

    // Handle form submission
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const countryCode = country.find((c) => c.name === data.country)?.code || "";

        const payload: OrganizationUpdateRequest = {
            name: data.name,
            timezone: user.timezone,
            country: countryCode,
            metadata: {},
            workingDays: data.workingDays,
            weekFirstDay: data.weekFirstDay,
        };

        setIsProcessing(true);

        updateOrganizationMutation.mutate(payload, {
            onSuccess: () => {
                toast({title: "Success", description: "Organization updated successfully!", variant: "default",});
            },
            onError: (error) => {
                toast({title: "Error", description: getErrorMessage(error), variant: "destructive",});
            },
            onSettled: () => {
                setIsProcessing(false);
            }
        });
    };

    return (
        <>
            <PageHeader title='Organization'></PageHeader>
            <PageContent>
                <Card className="mx-auto">
                    <div className="p-6 space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <NameField form={form}/>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <SelectField
                                            label="Country"
                                            name="country"
                                            options={country.map((country) => ({
                                                label: country.name,
                                                value: country.name
                                            }))}
                                            form={form}
                                        />

                                        <SelectField
                                            label="Week Starting Day"
                                            name="weekFirstDay"
                                            options={Object.values(Week).map((day) => ({
                                                label: getWeekDayName(day),
                                                value: day
                                            }))}
                                            form={form}
                                        />
                                    </div>

                                    <CheckboxGroupField form={form}/>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={() => form.reset()} type="button" variant="outline"
                                            className="mr-2">
                                        <X className="w-4 h-4 mr-2"/>
                                        Reset
                                    </Button>
                                    <Button type="submit" disabled={isProcessing}>
                                        <Save className="w-4 h-4 mr-2"/>
                                        {isProcessing ? 'Processing...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </Card>
            </PageContent>
        </>
    );
}


type FieldProps = {
    form: UseFormReturn
}

function NameField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({field}) => (
                <FormItem className="max-w-sm">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Organization Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

type SelectFieldProps = {
    name: string;
    label: string;
    options: { label: string; value: string }[];
    form: UseFormReturn<any>;
};

function SelectField({name, label, options, form}: SelectFieldProps) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Select onValueChange={(value) => form.setValue(name, value)} value={form.watch(name)}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${label}`}/>
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage/>
        </FormItem>
    );
}

function CheckboxGroupField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="workingDays"
            render={({field}) => (
                <FormItem className="space-y-2">
                    <FormLabel>Working Days</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.values(Week).map(day => (
                            <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                    id={day}
                                    value={day}
                                    checked={field.value.includes(day)}
                                    onCheckedChange={(isChecked) => {
                                        if (isChecked) {
                                            field.onChange([...field.value, day]);
                                        } else {
                                            field.onChange(field.value.filter((d: Week) => d !== day));
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={day}
                                    className="text-sm font-medium leading-none"
                                >
                                    {getWeekDayName(day)}
                                </label>
                            </div>
                        ))}
                    </div>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}