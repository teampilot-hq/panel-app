import React from "react";
import {useForm} from "react-hook-form";
import {TeamResponse} from "@/core/types/team.ts";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Save, X} from "lucide-react";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Team Name must be over 2 characters"
    }).max(20, {
        message: "Team Name must be under 20 characters"
    }),
});

type CreateTeamInputs = z.infer<typeof FormSchema>;

interface TeamCreateDialogProps {
    onClose: () => void;
    isOpen: boolean;
    teamList: TeamResponse[];
    onSubmit: (name: string) => void;
}

export default function TeamCreateDialog({isOpen, onClose, onSubmit, teamList}: TeamCreateDialogProps) {
    const form = useForm<CreateTeamInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    });

    const handleSubmit = (data: CreateTeamInputs) => {
        onSubmit(data.name);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Team</DialogTitle>
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
                                        <Input placeholder="Name" {...field} />
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
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}