import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Save, X} from "lucide-react";
import {LeavePolicyActivatedTypeResponse, LeaveTypeResponse} from "@/core/types/leave";
import {useParams} from "react-router-dom";

const FormSchema = z.object({
    typeId: z.number().min(1, {message: "Leave type is required."}),
    amount: z.number().min(1, {message: "Amount must be at least 1."}),
    requiresApproval: z.boolean(),
});

type FormInputs = z.infer<typeof FormSchema>;

type CreateDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    leaveTypes: LeaveTypeResponse[];
    activatedLeaveTypes: LeavePolicyActivatedTypeResponse[];
    onSave: (newType: LeavePolicyActivatedTypeResponse) => void;
};

export default function LeavePolicyActivatedTypeCreateDialog({
                                                                 isOpen,
                                                                 onClose,
                                                                 leaveTypes,
                                                                 activatedLeaveTypes,
                                                                 onSave,
                                                             }: CreateDialogProps) {
    const {id} = useParams();
    const form = useForm<FormInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            typeId: undefined,
            amount: 1,
            requiresApproval: false,
        },
    });

    const handleSubmit = (data: FormInputs) => {
        const selectedLeaveType = leaveTypes.find((type) => type.id === data.typeId);
        if (!selectedLeaveType) return;

        onSave({
            typeId: selectedLeaveType.id,
            amount: data.amount,
            requiresApproval: data.requiresApproval,
            name: selectedLeaveType.name,
            symbol: selectedLeaveType.symbol,
            status: selectedLeaveType.status,
            cycle: selectedLeaveType.cycle,
            policyId: Number(id),
        });

        onClose();
    };

    const availableLeaveTypes = leaveTypes?.filter(
        (type) =>
            type.status !== "ARCHIVED" &&
            !activatedLeaveTypes?.some((activatedType) => activatedType.typeId === type.id)
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Leave Type</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="typeId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Leave Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(value) => field.onChange(Number(value))}
                                                value={field.value?.toString() || ""}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a leave type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableLeaveTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name} {type.symbol}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Enter amount"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requiresApproval"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                        <FormLabel>Requires Approval</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button onClick={onClose} type="button" variant="secondary" className="mr-2">
                                <X className="w-4 h-4 mr-2"/>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2"/>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}