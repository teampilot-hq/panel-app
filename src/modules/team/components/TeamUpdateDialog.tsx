import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TeamResponse} from "@/core/types/team.ts";
import {Save, X} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Team name must be at least 2 characters long",
    }).max(20, {
        message: "Team name must be under 20 characters",
    })
});

type UpdateTeamInputs = z.infer<typeof FormSchema>;

interface TeamUpdateDialogProps {
    team: TeamResponse;
    onClose: () => void;
    onSubmit: (data: UpdateTeamInputs, teamId: number) => void;
}

export default function TeamUpdateDialog({team, onClose, onSubmit}: TeamUpdateDialogProps) {
    const form = useForm<UpdateTeamInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: team.name || ''
        },
    });

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Team</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => onSubmit(data, team.id))} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter team name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
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
                                Update Team
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}