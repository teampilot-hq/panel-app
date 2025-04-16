import React, {useEffect, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {getUser, updateUser} from "@/core/services/userService";
import {TeamResponse} from "@/core/types/team.ts";
import {LeavePolicyResponse} from "@/core/types/leave.ts";
import {UserResponse, UserUpdateRequest} from "@/core/types/user.ts";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import PageContent from "@/components/layout/PageContent.tsx";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import PageHeader from "@/components/layout/PageHeader.tsx";
import {CalendarDays, UserCog, X} from "lucide-react";
import {UserRole, UserRoleJson} from "@/core/types/enum.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import dayjs from "dayjs";
import {Calendar} from "@/components/ui/calendar.tsx";
import {useLeavesPolicies} from "@/core/stores/leavePoliciesStore.ts";
import {useTeams} from "@/core/stores/teamStore.ts";

const FormSchema = z.object({
    firstName: z.string().min(1, {message: "First Name is required"}),
    lastName: z.string().min(1, {message: "Last Name is required"}),
    email: z.string().email({message: "Invalid email address"}),
    phone: z.string().optional(),
    teamId: z.number().positive({message: "Team selection is required"}),
    leavePolicyId: z.number().positive({message: "Leave Policy selection is required"}),
    role: z.nativeEnum(UserRole, {errorMap: () => ({message: "Role is required"})}),
    joinedAt: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({ invalid_type_error: "Start Date is required" }).refine((date) => !isNaN(date.getTime()), { message: "Start Date is required" }))
});

export default function UserUpdatePage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<UserResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const location = useLocation();

    const {data : leavesPolicies, isLoading, isError, error, isFetching, refetch} = useLeavesPolicies();
    const {data: teams} = useTeams();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            teamId: 0,
            leavePolicyId: 0,
            role: undefined,
            joinedAt: null
        },
    });

    const {reset} = form;

    // Fetch employee details
    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const employeeData = await getUser(id!);
                setEmployee(employeeData);
                reset({
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    email: employeeData.email,
                    phone: employeeData.phone || "",
                    teamId: employeeData.team.id,
                    leavePolicyId: employeeData.leavePolicy.id,
                    role: employeeData.role,
                    joinedAt: new Date(employeeData.joinedAt)
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch employee details.",
                    variant: "destructive",
                });
            }
        };

        fetchEmployeeDetails();
    }, [id, reset]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const payload: UserUpdateRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || null,
            teamId: data.teamId,
            leavePolicyId: data.leavePolicyId,
            role: data.role,
            joinedAt: data.joinedAt.toISOString()
        };

        try {
            setIsProcessing(true);
            await updateUser(id!, payload);
            toast({
                title: "Success",
                description: "Employee updated successfully!",
                variant: "default",
            });
            navigate("/users");
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!employee) {
        return <div>Loading...</div>;
    }

    const backButtonPath = location.state?.from || "/users";

    return (
        <>
            <PageHeader title="Update User" backButton={backButtonPath}></PageHeader>
            <PageContent>
                <Card className="mx-auto">
                    <div className="p-4 space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Personal Information</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FirstnameField form={form}/>
                                        <LastNameField form={form}/>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <EmailField form={form}/>
                                        <PhoneField form={form}/>
                                    </div>
                                </div>

                                {/* Work Settings Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Organization Configuration</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <RoleField form={form}/>
                                        <TeamField form={form} teams={teams}/>
                                        <LeavePolicyField form={form} leavePolicies={leavesPolicies}/>
                                        <StartDate form={form}/>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={() => navigate(backButtonPath)} type="button" variant="outline"
                                            className="mr-2">
                                        <X className="w-4 h-4 mr-2"/>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isProcessing}>
                                        <UserCog className="w-4 h-4 mr-2"/>
                                        {isProcessing ? 'Processing...' : 'Update'}
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

function FirstnameField({form}: { form: UseFormReturn }) {
    return (
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
    );
}

function LastNameField({form}: { form: UseFormReturn }) {
    return (
        <FormField
            control={form.control}
            name="lastName"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

function EmailField({form}: { form: UseFormReturn }) {
    return (
        <FormField
            control={form.control}
            name="email"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

function PhoneField({form}: { form: UseFormReturn }) {
    return (
        <FormField
            control={form.control}
            name="phone"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                        <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

function TeamField({form, teams}: { form: UseFormReturn, teams?: TeamResponse[] }) {
    return (
        <FormField
            control={form.control}
            name="teamId"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Team</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value !== 0 ? field.value?.toString() : ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a team"/>
                            </SelectTrigger>
                            <SelectContent>
                                {teams?.map((team) => (
                                    <SelectItem key={team.id} value={team.id.toString()}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

function LeavePolicyField({form, leavePolicies}: { form: UseFormReturn, leavePolicies?: LeavePolicyResponse[] }) {
    return (
        <FormField
            control={form.control}
            name="leavePolicyId"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Leave Policy</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value !== 0 ? field.value?.toString() : ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a leave policy"/>
                            </SelectTrigger>
                            <SelectContent>
                                {leavePolicies?.map((policy) => (
                                    <SelectItem key={policy.id} value={policy.id.toString()}>
                                        {policy.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

function RoleField({form}: { form: UseFormReturn }) {
    return (
        <FormField
            control={form.control}
            name="role"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={(value) => field.onChange(value as UserRole)}
                            value={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role"/>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(UserRole).map(([key, value]) => (
                                    <SelectItem key={key}
                                                value={value}>{UserRoleJson[key as keyof typeof UserRoleJson]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

function StartDate({form}: { form: UseFormReturn }) {
    const [popoverIsOpen, setPopoverIsOpen] = useState(false);

    return (
        <FormField
            control={form.control}
            name="joinedAt"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                        <Popover open={popoverIsOpen} onOpenChange={setPopoverIsOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={`w-full h-10 hover:bg-white px-3 font-normal ${!field.value ? "border-red-500 text-red-500" : ""}`}
                                    onClick={() => setPopoverIsOpen(true)}
                                >
                                    {field.value ? (
                                        <span>{dayjs(field.value).format('D MMM YYYY')}</span>
                                    ) : (
                                        <span className="text-red-500">Pick a date</span>
                                    )}
                                    <CalendarDays className="ml-auto h-4 w-4 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto border rounded-lg p-0 shadow-lg bg-white" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        field.onChange(date || null);
                                        setPopoverIsOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}