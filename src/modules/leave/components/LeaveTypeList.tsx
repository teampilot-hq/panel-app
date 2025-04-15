import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Pencil, Plus, Trash} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import {PageSection} from "@/components/layout/PageSection";
import {LeaveTypeCreateRequest, LeaveTypeResponse, LeaveTypeUpdateRequest} from "@/core/types/leave";
import {getErrorMessage} from "@/core/utils/errorHandler";
import {LeaveTypeCycleJson} from "@/core/types/enum";
import {LeaveTypeDialog} from "@/modules/leave/components/LeaveTypeDialog.tsx";
import {DeleteDialog} from "@/modules/leave/components/DeleteDialog.tsx";
import {useCreateLeavesType, useDeleteLeaveType, useLeaveTypes, useUpdateLeaveType} from "@/core/stores/leaveTypesStore.ts";

export default function LeaveTypeList() {
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeResponse | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const {data: leaveTypes} = useLeaveTypes();
    const createLeaveTypeMutation = useCreateLeavesType();
    const updateLeaveTypeMutation = useUpdateLeaveType();
    const deleteLeaveTypeMutation = useDeleteLeaveType();


    const handleUpdateLeaveType = (data: LeaveTypeUpdateRequest, id: number) => {
        updateLeaveTypeMutation.mutate(
            {data, id},
            {
                onSuccess: () => {
                    toast({title: "Success", description: "Leave type updated successfully!"});
                },
                onError: (error) => {
                    toast({title: "Error", description: getErrorMessage(error), variant: "destructive",});
                },
                onSettled: () => {
                    console.log('onSettled executed');
                    setIsDialogOpen(false);
                }
            }
        )
    };

    const handleCreateLeaveType = (data: LeaveTypeCreateRequest) => {
        createLeaveTypeMutation.mutate(data, {
            onSuccess: () => {
                toast({ title: "Success", description: "Leave type created successfully!" });
                setIsDialogOpen(false);
            },
            onError: (error) => {
                toast({title: "Error", description: getErrorMessage(error), variant: "destructive",});
                setIsDialogOpen(false);
            },
        });
    };

    const handleRemoveLeaveType = () => {
        if (!selectedLeaveType) return;

        setIsProcessing(true);

        deleteLeaveTypeMutation.mutate(selectedLeaveType.id, {
            onSuccess: () => {
                toast({title: "Success", description: "Leave type removed successfully!", variant: "default"});
            },
            onError: (error) => {
                toast({title: "Error", description: getErrorMessage(error as Error), variant: "destructive"});
            },
            onSettled: () => {
                setIsProcessing(false);
                setSelectedLeaveType(null);
                setIsDeleteDialogOpen(false);
            }
        });
    };

    const sortedLeaveTypes = leaveTypes?.sort((a) => (a.status === "ARCHIVED" ? 1 : -1));

    return (
        <>
            <PageSection title="Leave Types"
                         description={"Manage leave types by details. Create, update, or archive leave types as needed."}>
                <Button
                    onClick={() => {
                        setIsUpdateMode(false);
                        setSelectedLeaveType(null);
                        setIsDialogOpen(true);
                    }}
                    className="px-2 h-9"
                >
                    <Plus className="h-4 w-4 mr-1"/>
                    Create
                </Button>
            </PageSection>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Cycle</TableHead>
                            <TableHead>Requires Approval</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedLeaveTypes?.map((leaveType) => (
                            <LeaveTypeRowItem
                                key={leaveType.id}
                                leaveType={leaveType}
                                openDialog={() => {
                                    setSelectedLeaveType(leaveType);
                                    setIsUpdateMode(true);
                                    setIsDialogOpen(true);
                                }}
                                openDeleteDialog={() => {
                                    setSelectedLeaveType(leaveType);
                                    setIsDeleteDialogOpen(true);
                                }}
                            />
                        ))}
                    </TableBody>
                </Table>

                {isDialogOpen && (
                    <LeaveTypeDialog
                        isOpen={isDialogOpen}
                        onClose={() => {
                            setIsDialogOpen(false);
                            setSelectedLeaveType(null);
                        }}
                        isUpdateMode={isUpdateMode}
                        initialData={isUpdateMode ? selectedLeaveType : null}
                        onSubmit={(data) => {
                            if (isUpdateMode && selectedLeaveType?.id) {
                                handleUpdateLeaveType(data as LeaveTypeUpdateRequest, selectedLeaveType.id);
                            } else {
                                handleCreateLeaveType(data as LeaveTypeCreateRequest);
                            }
                        }}
                    />
                )}

                {isDeleteDialogOpen && selectedLeaveType && (
                    <DeleteDialog
                        name="Leave Type"
                        label={selectedLeaveType.name}
                        handleReject={() => setIsDeleteDialogOpen(false)}
                        handleAccept={handleRemoveLeaveType}
                    />
                )}
            </Card>
        </>
    );
}

type LeaveTypeRowItemProps = {
    leaveType: LeaveTypeResponse;
    openDialog: () => void;
    openDeleteDialog: () => void;
};

function LeaveTypeRowItem({leaveType, openDialog, openDeleteDialog}: LeaveTypeRowItemProps) {
    const isArchived = leaveType.status === "ARCHIVED";

    return (
        <TableRow className={`${isArchived ? "opacity-50" : ""} hover:bg-muted/50 transition-colors`}>
            <TableCell className="font-medium">
                <span className="mr-1 text-muted-foreground">{leaveType.symbol}</span>
                {leaveType.name}
            </TableCell>
            <TableCell>{leaveType.amount}</TableCell>
            <TableCell>{LeaveTypeCycleJson[leaveType.cycle]}</TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        leaveType.requiresApproval
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                    }`}
                >
                    {leaveType.requiresApproval ? "Yes" : "No"}
                </span>
            </TableCell>
            <TableCell>
                {!isArchived ? (
                    <div className="flex gap-2">
                        <Button
                            className="px-1 hover:bg-muted/80 transition-colors"
                            variant="ghost"
                            size="sm"
                            onClick={openDialog}
                        >
                            <Pencil className="h-4 text-muted-foreground"/>
                        </Button>
                        <Button
                            className="px-1 hover:bg-red-50 transition-colors"
                            variant="ghost"
                            size="sm"
                            onClick={openDeleteDialog}
                        >
                            <Trash className="h-4 text-red-500"/>
                        </Button>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground italic">Archived</span>
                )}
            </TableCell>
        </TableRow>
    );
}