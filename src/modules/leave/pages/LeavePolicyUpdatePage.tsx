import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Pencil, Plus, Save, X} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import LeavePolicyActivatedTypeUpdateDialog from "@/modules/leave/components/LeavePolicyActivatedTypeUpdateDialog.tsx";
import {
    LeavePolicyActivatedTypeResponse, LeavePolicyResponse,
    LeavePolicyStatus,
} from "@/core/types/leave.ts";
import {getErrorMessage} from "@/core/utils/errorHandler";
import {LeavePolicyTable} from "@/modules/leave/components/LeavePolicyTable.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import LeavePolicyActivatedTypeCreateDialog from "@/modules/leave/components/LeavePolicyActivatedTypeCreateDialog.tsx";
import {useLeavesPolicy, useUpdateLeavePolicy} from "@/core/stores/leavePoliciesStore.ts";
import {useLeaveTypes} from "@/core/stores/leaveTypesStore.ts";

export default function LeavePolicyUpdatePage() {
    const {id} = useParams();
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeavePolicyActivatedTypeResponse | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const navigate = useNavigate();
    const [editedPolicy, setEditedPolicy] = useState<LeavePolicyResponse | null>(null);

    const {data : leavesPolicy} = useLeavesPolicy(Number(id));
    const {data: leaveTypes} = useLeaveTypes();
    const updateLeavePolicyMutation = useUpdateLeavePolicy();

    useEffect(() => {
        if (leavesPolicy) {
            setEditedPolicy(leavesPolicy);
        }
    }, [leavesPolicy]);

    // Handle Policy Name Change
    const savePolicyName = () => {
        if (!editedPolicy) return;

        const updatedName = editedPolicy.name;

        if (!editedPolicy.name) {
            toast({
                title: "Error",
                description: "Policy name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        setEditedPolicy({...editedPolicy, name: updatedName});
        setIsEditingName(false);
    };

    // Handle Add Leave Type
    const addLeaveType = (newType: LeavePolicyActivatedTypeResponse) => {
        if (!editedPolicy) return;

        setEditedPolicy({
            ...editedPolicy,
            activatedTypes: [...editedPolicy.activatedTypes, newType],
        });

        setIsCreateDialogOpen(false);
    };

    // Handle Update Leave Type
    const updateLeaveType = (updatedType: LeavePolicyActivatedTypeResponse) => {
        if (!editedPolicy) return;

        setEditedPolicy({
            ...editedPolicy,
            activatedTypes: editedPolicy.activatedTypes.map((type) =>
                type.typeId === updatedType.typeId ? updatedType : type
            ),
        });

        setIsUpdateDialogOpen(false);
        setSelectedLeaveType(null);
    };

    // Handle Remove Leave Type
    const removeLeaveType = (typeId: number) => {
        if (!editedPolicy) return;

        setEditedPolicy({
            ...editedPolicy,
            activatedTypes: editedPolicy.activatedTypes.filter((type) => type.typeId !== typeId),
        });
    };

    // Save Final Changes
    const savePolicy = async () => {
        if (!editedPolicy) return;

        updateLeavePolicyMutation.mutate(
            {
                payload: {
                    name: editedPolicy.name,
                    activatedTypes: editedPolicy.activatedTypes,
                    status: LeavePolicyStatus.ACTIVE,
                },
                id: editedPolicy.id
            },
            {
                onSuccess: () => {
                    toast({title: "Success", description: "Leave policy updated successfully.", variant: "default"});
                    navigate("/leaves/policies");
                },
                onError: (error) => {
                    const errorMessage = getErrorMessage(error as Error | string);
                    toast({title: "Error", description: errorMessage, variant: "destructive"});
                }
            }
        );
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
                            value={editedPolicy?.name}
                            onChange={(e) => {
                                if (editedPolicy) {
                                    setEditedPolicy({...editedPolicy!, name: e.target.value})
                                }
                            }}
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
                            {editedPolicy?.name}
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
                        activatedTypes={editedPolicy?.activatedTypes ?? []}
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