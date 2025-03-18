import {LeavePolicyActivatedTypeResponse} from "@/core/types/leave.ts";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import React from "react";
import {LeaveTypeCycleJson} from "@/core/types/enum.ts";
import {Badge} from "@/components/ui/badge.tsx";

type LeavePolicyTableProps = {
    activatedTypes: LeavePolicyActivatedTypeResponse[];
    onEdit: (type: LeavePolicyActivatedTypeResponse) => void;
    onRemove: (id: number) => void;
};

export function LeavePolicyTable({onEdit, activatedTypes, onRemove}: LeavePolicyTableProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Requires Approval</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {activatedTypes?.map((activatedType) => {
                        return (
                            <TableRow key={activatedType.typeId}>
                                <TableCell>{activatedType?.name || "Unknown"} {activatedType.symbol}</TableCell>
                                <TableCell>
                                    <Badge
                                        key={activatedType.typeId}
                                        variant="outline"
                                        className="inline-flex items-center bg-gray-50 text-gray-700 rounded-lg p-0 text-sm font-medium"
                                    >
                                        <span className="p-1 px-2 font-semibold text-primary">{activatedType.amount} Days</span>
                                        <span className="p-1 px-2 border-l  pl-2 text-gray-500 ml-1">{LeaveTypeCycleJson[activatedType.cycle].toUpperCase()}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                <span
                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                        activatedType.requiresApproval
                                            ? "bg-green-50 text-green-700 ring-green-600/20"
                                            : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                    }`}
                                >
                                    {activatedType.requiresApproval ? "Yes" : "No"}
                                </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            className="px-1 hover:bg-muted/80 transition-colors"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                onEdit(activatedType);
                                            }}
                                        >
                                            <Pencil className="h-4 text-muted-foreground"/>
                                        </Button>

                                        <Button
                                            type="button"
                                            className="px-1 hover:bg-red-50 transition-colors"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                onRemove(activatedType.typeId);
                                            }}
                                        >
                                            <Trash className="h-4 text-red-500"/>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>

                {activatedTypes.length === 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">This leave policy doesn't have any leave types
                                yet. Please click the button above to add a leave type.</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}