import React, {useState} from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Save, X} from "lucide-react";
import {useUpdateTeam} from "@/core/stores/teamStore.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {toast} from "@/components/ui/use-toast.ts";

type UpdateTeamDialogProps = {
    teamId: number;
    teamName: string;
    onClose: () => void;
};

const FormSchema = z.object({
    name: z.string().min(2, {message: "Team name must be at least 2 characters"}).max(20, {
        message: "Team name must be under 20 characters",
    }),
});

export default function TeamUpdateDialog({teamId, teamName, onClose}: UpdateTeamDialogProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const updateTeamMutation = useUpdateTeam();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {name: teamName},
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsProcessing(true);

        updateTeamMutation.mutate(
            { id: teamId, data: { name: data.name, metadata: {} } },
            {
                onSuccess: () => {
                    toast({ title: "Success", description: "Team updated successfully!" });
                    onClose();
                },
                onError: (error) => {
                    const message = getErrorMessage(error);
                    toast({ title: "Error", description: message, variant: "destructive" });
                },
                onSettled: () => {
                    setIsProcessing(false);
                }
            }
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input {...form.register("name")} />
                    </div>
                    <DialogFooter>
                        <Button onClick={onClose} type="button" variant="outline" className="mr-2">
                            <X className="w-4 h-4 mr-2"/>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isProcessing}>
                            <Save className="w-4 h-4 mr-2"/>
                            {isProcessing ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}