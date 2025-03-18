import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Save, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {ApprovalMode} from "@/core/types/leave.ts";
import React, {useEffect, useState} from "react";
import {UserResponse} from "@/core/types/user.ts";
import {getUsers} from "@/core/services/userService.ts";
import {UserRole} from "@/core/types/enum.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";

const FormSchema = z.object({
    name: z.string().min(2, {message: "Leave policy name must be over 2 characters"}).max(50, {message: "Leave policy name must be under 50 characters"}),
    teamApprovers: z.array(z.string()).min(1, {message: "Please select at least one team approver.",}),
    approvalMode: z.nativeEnum(ApprovalMode, {required_error: "Please select an approval mode.",}),
});

type PolicyInputs = z.infer<typeof FormSchema>;

type CreatePolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, teamApprover: string[], approvalMode: ApprovalMode) => void;
};

export function CreatePolicyDialog({isOpen, onClose, onSubmit}: CreatePolicyDialogProps) {
    const [organizationAdmins, setOrganizationAdmins] = useState<UserResponse[]>([]);

    const form = useForm<PolicyInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            teamApprovers: [],
            approvalMode: ApprovalMode.ANY,
        },
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers(0, 100);
            const admins = response.contents.filter(user => user.role === UserRole.ORGANIZATION_ADMIN);
            setOrganizationAdmins(admins);
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        }
    };

    const handleSubmit = (data: PolicyInputs) => {
        onSubmit(data.name, data.teamApprovers, data.approvalMode);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Leave Policy</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter leave policy name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="approvalMode"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Approval Mode</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="ALL" id="all-approve"/>
                                                <Label
                                                    htmlFor="all-approve"
                                                    className="flex items-center gap-2"
                                                >
                                                    All Admins Must Approve
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="ANY" id="any-approve"/>
                                                <Label
                                                    htmlFor="any-approve"
                                                    className="flex items-center gap-2"
                                                >
                                                    Any Admin Can Approve
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="teamApprovers"
                            render={({field}) => {
                                const selectedApprovers = field.value;

                                return (
                                    <FormItem>
                                        <FormLabel>Team Approvers</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-2">
                                                {organizationAdmins.map((admin) => {
                                                    const adminId = admin.id.toString();
                                                    const isSelected = selectedApprovers.includes(adminId);

                                                    return (
                                                        <Button
                                                            key={admin.id}
                                                            type="button"
                                                            variant="outline"
                                                            className={`px-3 h-10 flex items-center gap-3 ${
                                                                isSelected
                                                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                                                    : "bg-gray-100 border-gray-300 text-gray-900"
                                                            }`}
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    field.onChange(selectedApprovers.filter((id) => id !== adminId));
                                                                } else {
                                                                    field.onChange([...selectedApprovers, adminId]);
                                                                }
                                                            }}
                                                        >
                                                            {admin.firstName} {admin.lastName}
                                                        </Button>
                                                    );
                                                })}

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={`px-3 h-10 flex items-center gap-3 ${
                                                        selectedApprovers.includes("Team Admin")
                                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                                            : "bg-gray-100 border-gray-300 text-gray-900"
                                                    }`}
                                                    onClick={() => {
                                                        if (selectedApprovers.includes("Team Admin")) {
                                                            field.onChange(selectedApprovers.filter((id) => id !== "Team Admin"));
                                                        } else {
                                                            field.onChange([...selectedApprovers, "Team Admin"]);
                                                        }
                                                    }}
                                                >
                                                    Team Admin
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                );
                            }}
                        />

                        <DialogFooter>
                            <Button onClick={onClose} type="button" variant="secondary" className="mr-2">
                                <X className="w-4 h-4 mr-2"/>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2"/>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}