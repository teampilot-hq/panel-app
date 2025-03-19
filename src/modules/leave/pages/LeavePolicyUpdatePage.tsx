import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Separator} from "@/components/ui/separator";
import {Save, X, Plus} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {getLeavesPolicy, getLeavesTypes, updateLeavePolicy} from "@/core/services/leaveService";
import {ApprovalMode, LeavePolicyActivatedTypeResponse, LeavePolicyResponse, LeavePolicyStatus, LeaveTypeResponse} from "@/core/types/leave";
import {getErrorMessage} from "@/core/utils/errorHandler";
import LeavePolicyActivatedTypeCreateDialog from "@/modules/leave/components/LeavePolicyActivatedTypeCreateDialog";
import LeavePolicyActivatedTypeUpdateDialog from "@/modules/leave/components/LeavePolicyActivatedTypeUpdateDialog";
import {LeavePolicyTable} from "@/modules/leave/components/LeavePolicyTable";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import {Card, CardContent } from "@/components/ui/card";

const FormSchema = z.object({
    name: z.string().min(1, "Policy name is required"),
    teamApprovers: z.array(z.string()).min(1, "At least one approver is required"),
    approvalMode: z.nativeEnum(ApprovalMode),
});

type LeavePolicyFormInputs = z.infer<typeof FormSchema>;

export default function LeavePolicyUpdatePage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [leavePolicy, setLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponse[]>([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeavePolicyActivatedTypeResponse | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

    const commonApprovers = ["Team Admin", "HR Manager", "Department Head", "Line Manager", "Team Lead"];

    const form = useForm<LeavePolicyFormInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            teamApprovers: ["Team Admin"],
            approvalMode: ApprovalMode.ANY,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const policy = await getLeavesPolicy(Number(id));
                setLeavePolicy(policy);
                form.reset({
                    name: policy.name ?? "",
                    teamApprovers: policy.teamApprovers ?? ["Team Admin"],
                    approvalMode: policy.approvalMode ?? ApprovalMode.ANY,
                });
            } catch (error) {
                toast({ title: "Error", description: getErrorMessage(error as Error), variant: "destructive" });
            }
        };

        const fetchLeaveTypes = async () => {
            try {
                const types = await getLeavesTypes();
                setLeaveTypes(types);
            } catch (error) {
                toast({ title: "Error", description: getErrorMessage(error as Error), variant: "destructive" });
            }
        };

        fetchData();
        fetchLeaveTypes();
    }, [id]);

    const handleSave = async (data: LeavePolicyFormInputs) => {
        if (!leavePolicy) return;

        try {
            await updateLeavePolicy({
                name: data.name,
                activatedTypes: leavePolicy.activatedTypes,
                status: LeavePolicyStatus.ACTIVE,
                teamApprovers: data.teamApprovers,
                approvalMode: data.approvalMode,
            }, leavePolicy.id);

            toast({ title: "Success", description: "Leave policy updated successfully" });
            navigate("/leaves/policies");
        } catch (error) {
            toast({ title: "Error", description: getErrorMessage(error as Error), variant: "destructive" });
        }
    };

    const addLeaveType = (newType: LeavePolicyActivatedTypeResponse) => {
        if (!leavePolicy) return;
        setLeavePolicy({ ...leavePolicy, activatedTypes: [...leavePolicy.activatedTypes, newType] });
        setIsCreateDialogOpen(false);
    };

    const updateLeaveType = (updatedType: LeavePolicyActivatedTypeResponse) => {
        if (!leavePolicy) return;
        setLeavePolicy({
            ...leavePolicy,
            activatedTypes: leavePolicy.activatedTypes.map(type =>
                type.typeId === updatedType.typeId ? updatedType : type
            ),
        });
        setIsUpdateDialogOpen(false);
        setSelectedLeaveType(null);
    };

    const removeLeaveType = (typeId: number) => {
        if (!leavePolicy) return;
        setLeavePolicy({
            ...leavePolicy,
            activatedTypes: leavePolicy.activatedTypes.filter(type => type.typeId !== typeId),
        });
    };

    return (
        <>
            <PageHeader title="Update Leave Policy" backButton="/leaves/policies">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Leave Type
                </Button>
            </PageHeader>

            <PageContent>
                <Card className="mx-auto">
                    <CardContent className='p-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Basic Information</h3>
                            <Separator />
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Policy Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter policy name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Approval Settings</h3>
                            <Separator />

                            <FormField control={form.control} name="approvalMode" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Approval Mode</FormLabel>
                                    <div className="flex gap-4">
                                        <Button type="button" variant={field.value === ApprovalMode.ANY ? "secondary" : "outline"}
                                                onClick={() => field.onChange(ApprovalMode.ANY)}>
                                            ANY
                                        </Button>
                                        <Button type="button" variant={field.value === ApprovalMode.ALL ? "secondary" : "outline"}
                                                onClick={() => field.onChange(ApprovalMode.ALL)}>
                                            ALL
                                        </Button>
                                    </div>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="teamApprovers" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Team Approvers</FormLabel>
                                    <div className="flex gap-2 flex-wrap">
                                        {commonApprovers.map((approver) => {
                                            const isSelected = field.value.includes(approver);
                                            return (
                                                <Button
                                                    key={approver}
                                                    type="button"
                                                    variant={isSelected ? "secondary" : "outline"}
                                                    onClick={() => {
                                                        const newValue = isSelected
                                                            ? field.value.filter(a => a !== approver)
                                                            : [...field.value, approver];
                                                        field.onChange(newValue);
                                                    }}
                                                >
                                                    {approver}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Leave Types</h3>
                            <Separator />
                            <LeavePolicyTable
                                activatedTypes={leavePolicy?.activatedTypes ?? []}
                                onEdit={(type) => {
                                    setSelectedLeaveType(type);
                                    setIsUpdateDialogOpen(true);
                                }}
                                onRemove={removeLeaveType}
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t gap-4">
                            <Button variant="outline" onClick={() => navigate('/leaves/policies')}>
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2" /> Update
                            </Button>
                        </div>
                    </form>
                </Form>
                    </CardContent>
                </Card>
            </PageContent>

            <LeavePolicyActivatedTypeCreateDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                leaveTypes={leaveTypes}
                onSave={addLeaveType}
                activatedLeaveTypes={leavePolicy?.activatedTypes}
            />

            <LeavePolicyActivatedTypeUpdateDialog
                isOpen={isUpdateDialogOpen}
                onClose={() => setIsUpdateDialogOpen(false)}
                onSave={updateLeaveType}
                defaultValues={selectedLeaveType || undefined}
            />
        </>
    );
}
