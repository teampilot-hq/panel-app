import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import {DeleteDialog} from "@/modules/leave/components/DeleteDialog";
import {Pencil, Plus, Trash} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {CreatePolicyDialog} from "@/modules/leave/components/LeavePolicyCreateDialog.tsx";
import {PageSection} from "@/components/layout/PageSection.tsx";
import {ApprovalMode, LeavePolicyResponse, LeavePolicyStatus} from "@/core/types/leave.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {createLeavesPolicy, deleteLeavePolicy, getLeavesPolicies} from "@/core/services/leaveService.ts";
import {LeaveTypeCycleJson} from "@/core/types/enum.ts";

export default function LeavePolicyList() {
    const [leavePolicyList, setLeavePolicyList] = useState<LeavePolicyResponse[]>([]);
    const [selectedLeavePolicy, setSelectedLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const navigate = useNavigate();

    // Fetch leave policies
    useEffect(() => {
        const fetchLeavePolicies = async () => {
            try {
                const policies = await getLeavesPolicies();
                setLeavePolicyList(policies);
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error),
                    variant: "destructive",
                });
            }
        };

        fetchLeavePolicies();
    }, []);

    const createLeavePolicy = async (name: string) => {
        try {
            setIsProcessing(true);
            setIsCreateDialogOpen(false);

            await createLeavesPolicy({
                name: name,
                status: LeavePolicyStatus.ACTIVE,
                activatedTypes: [],
                teamApprovers: [],
                approvalMode: ApprovalMode.ALL,
            });

            toast({
                title: "Success",
                description: "leave policy created successfully!",
                variant: "default",
            });

            // Refresh leave policies after creation
            const updatedPolicies = await getLeavesPolicies();
            setLeavePolicyList(updatedPolicies);

            // Navigate to the created policy
            const newPolicy = updatedPolicies.find((policy) => policy.name === name);
            if (newPolicy) {
                navigate(`/leaves/policies/${newPolicy.id}`);
            }
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

    const handleRemoveLeavePolicy = async () => {
        if (!selectedLeavePolicy) return;

        try {
            setIsProcessing(true);

            await deleteLeavePolicy(selectedLeavePolicy.id);

            // Update the policy list locally
            setLeavePolicyList((prev) => prev.filter((policy) => policy.id !== selectedLeavePolicy.id));

            toast({
                title: "Success",
                description: "leave policy removed successfully!",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedLeavePolicy(null);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <>
            <PageSection title='Leave Policies'
                         description={"Manage leave policies for your organization. Set up policy details, including leave types and approval requirements. Create, update, or delete policies as needed."}>
                <Button onClick={() => setIsCreateDialogOpen(true)} className='px-2 h-9'>
                    <Plus className="h-4 w-4 mr-1"/>
                    Create</Button>
            </PageSection>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Types</TableHead>
                            <TableHead>Approval Mode</TableHead>
                            <TableHead>Approver</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leavePolicyList.map((leavePolicy) => (
                            <LeavePolicyRowItem
                                key={leavePolicy.id}
                                leavePolicy={leavePolicy}
                                setSelectedLeavePolicy={setSelectedLeavePolicy}
                                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                                isProcessing={isProcessing}
                                navigate={navigate}
                            />
                        ))}
                    </TableBody>
                </Table>

                <CreatePolicyDialog
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    onSubmit={(name) => createLeavePolicy(name )}
                />

                {isDeleteDialogOpen && selectedLeavePolicy && (
                    <DeleteDialog
                        name="Leave Policy"
                        label={selectedLeavePolicy.name}
                        handleReject={() => setIsDeleteDialogOpen(false)}
                        handleAccept={handleRemoveLeavePolicy}
                    />
                )}
            </Card>
        </>
    );
}

// Row Item Component for leave Types
type LeavePolicyRowItemProps = {
    leavePolicy: LeavePolicyResponse;
    setSelectedLeavePolicy: (leavePolicy: LeavePolicyResponse | null) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    isProcessing: boolean;
    navigate: NavigateFunction;
};

function LeavePolicyRowItem({
                                navigate,
                                leavePolicy,
                                setSelectedLeavePolicy,
                                setIsDeleteDialogOpen,
                                isProcessing,
                            }: LeavePolicyRowItemProps) {
    const exampleData = [
        {teamApprover: ['Rozita Hasani', 'Team Admin'], approvalMode: ApprovalMode.ALL},
        {teamApprover: ['Team Admin'], approvalMode: ApprovalMode.ANY},
    ];
    const mockData = exampleData[Math.floor(Math.random() * exampleData.length)];

    return (
        <TableRow key={leavePolicy.id}>
            <TableCell>{leavePolicy.name}</TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-2">
                    {leavePolicy.activatedTypes.map((activatedType) => (
                        <Badge
                            key={activatedType.typeId}
                            variant="outline"
                            className="inline-flex items-center bg-gray-100 text-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium border-none"
                        >
                            <span className="mr-1.5 text-base">{activatedType.symbol}</span>
                            <span className="mr-1">{activatedType.name}:</span>
                            <span className="font-semibold text-primary">{activatedType.amount}d</span>
                            <span className="text-gray-500 ml-1">{LeaveTypeCycleJson[activatedType.cycle]}</span>
                        </Badge>
                    ))}
                </div>
            </TableCell>

            <TableCell>
                <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        mockData.approvalMode === ApprovalMode.ALL
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                    }`}
                >
                    {mockData.approvalMode === ApprovalMode.ALL ? ApprovalMode.ALL : ApprovalMode.ANY}
                </span>
            </TableCell>
            <TableCell className="space-x-1 space-y-1">
                {mockData.teamApprover.map((approver) => (<Badge variant='outline'>{approver}</Badge>))}
            </TableCell>

            <TableCell className="text-right">
                <div className="flex gap-2">
                    <Button
                        className="px-1"
                        variant="ghost"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => navigate(`/leaves/policies/${leavePolicy.id}`, {state: {leavePolicy}})}
                    >
                        <Pencil className="h-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-1"
                        disabled={isProcessing}
                        onClick={() => {
                            setSelectedLeavePolicy(leavePolicy);
                            setIsDeleteDialogOpen(true);
                        }}
                    >
                        <Trash className="h-4 text-[#ef4444]"/>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}