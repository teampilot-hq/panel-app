import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Pencil, Plus, Save, X} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import {getLeavesTypes, updateLeavePolicy,} from "@/core/services/leaveService";
import LeavePolicyActivatedTypeUpdateDialog from "@/modules/leave/components/LeavePolicyActivatedTypeUpdateDialog.tsx";
import {
    LeavePolicyActivatedTypeResponse,
    LeavePolicyResponse,
    LeavePolicyStatus,
    LeaveTypeResponse
} from "@/core/types/leave.ts";
import {getErrorMessage} from "@/core/utils/errorHandler";
import {LeavePolicyTable} from "@/modules/leave/components/LeavePolicyTable.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import LeavePolicyActivatedTypeCreateDialog from "@/modules/leave/components/LeavePolicyActivatedTypeCreateDialog.tsx";
import {useLeavesPolicy} from "@/core/stores/leavePoliciesStore.ts";

export default function LeavePolicyUpdatePage() {
    const {id} = useParams();
    const [leavePolicy, setLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponse[]>([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeavePolicyActivatedTypeResponse | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const navigate = useNavigate();

    const {data : leavesPolicy} = useLeavesPolicy(Number(id));

    // Fetch leave Types
    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const types = await getLeavesTypes();
                setLeaveTypes(types);
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error),
                    variant: "destructive",
                });
            }
        };

        fetchLeaveTypes();
    }, []);

    // Handle Policy Name Change
    const savePolicyName = async () => {
        if (!leavesPolicy) return;

        const updatedName = leavePolicy.name;

        if (!updatedName) {
            toast({
                title: "Error",
                description: "Policy name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        setLeavePolicy({...leavePolicy, name: updatedName});
        setIsEditingName(false);
    };

    // Handle Add Leave Type
    const addLeaveType = (newType: LeavePolicyActivatedTypeResponse) => {
        if (!leavesPolicy) return;

        setLeavePolicy({
            ...leavePolicy,
            activatedTypes: [...leavePolicy.activatedTypes, newType],
        });

        setIsCreateDialogOpen(false);
    };

    // Handle Update Leave Type
    const updateLeaveType = (updatedType: LeavePolicyActivatedTypeResponse) => {
        if (!leavesPolicy) return;

        setLeavePolicy({
            ...leavePolicy,
            activatedTypes: leavePolicy.activatedTypes.map((type) =>
                type.typeId === updatedType.typeId ? updatedType : type
            ),
        });

        setIsUpdateDialogOpen(false);
        setSelectedLeaveType(null);
    };

    // Handle Remove Leave Type
    const removeLeaveType = (typeId: number) => {
        if (!leavesPolicy) return;

        setLeavePolicy({
            ...leavePolicy,
            activatedTypes: leavePolicy.activatedTypes.filter((type) => type.typeId !== typeId),
        });
    };

    // Save Final Changes
    const savePolicy = async () => {
        if (!leavesPolicy) return;

        try {
            await updateLeavePolicy(
                {
                    name: leavePolicy.name,
                    activatedTypes: leavePolicy.activatedTypes,
                    status: LeavePolicyStatus.ACTIVE,
                },
                leavePolicy.id
            );

            toast({
                title: "Success",
                description: "Leave policy updated successfully",
                variant: "default",
            });

            navigate("/leaves/policies");
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <PageHeader title={`Update Leave Policy`} backButton="/leaves/policies">
                <Button className='px-2 h-9' onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Leave Type
                </Button>
            </PageHeader>

            <PageContent>
                {isEditingName ? (
                    <CardHeader className="p-0 pb-6 flex flex-row items-center space-y-0">
                        <Input
                            value={leavesPolicy.name}
                            onChange={(e) => setLeavePolicy({...leavePolicy!, name: e.target.value})}
                            placeholder="Enter policy name"
                            className="flex-1"
                        />
                        <Button
                            className="w-full sm:w-auto ml-2"
                            onClick={savePolicyName}
                            variant='outline'
                        >
                            <Save className="h-4 w-4 mr-2"/>
                            Save
                        </Button>
                    </CardHeader>
                ) : (
                    <CardHeader className="p-0 pb-6">
                        <CardTitle className="text-xl">
                            {leavesPolicy?.name}
                            <Button
                                className="w-full sm:w-auto ml-2"
                                variant="outline"
                                onClick={() => setIsEditingName(true)}
                            >
                                <Pencil className="h-4 w-4 mr-2"/>
                                Update
                            </Button>
                        </CardTitle>
                    </CardHeader>
                )}

                <Card>
                    <LeavePolicyTable
                        activatedTypes={leavesPolicy?.activatedTypes ?? []}
                        onEdit={(type) => {
                            setSelectedLeaveType(type);
                            setIsUpdateDialogOpen(true);
                        }}
                        onRemove={removeLeaveType}
                    />
                </Card>

                {leavesPolicy?.activatedTypes && (
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/leaves/policies')}
                        >
                            <X className="w-4 h-4 mr-2"/>
                            Cancel
                        </Button>
                        <Button onClick={savePolicy}>
                            <Save className="w-4 h-4 mr-2"/>
                            Save
                        </Button>
                    </div>
                )}
            </PageContent>

            <LeavePolicyActivatedTypeCreateDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                leaveTypes={leaveTypes}
                onSave={addLeaveType}
                activatedLeaveTypes={leavesPolicy?.activatedTypes}
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