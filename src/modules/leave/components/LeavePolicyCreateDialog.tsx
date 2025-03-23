import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Save, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

const FormSchema = z.object({
    name: z.string().min(2, {message: "Leave policy name must be over 2 characters"}).max(50, {message: "Leave policy name must be under 50 characters"})
});

type PolicyInputs = z.infer<typeof FormSchema>;

type CreatePolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
};

export function CreatePolicyDialog({isOpen, onClose, onSubmit}: CreatePolicyDialogProps) {

    const form = useForm<PolicyInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: ""
        },
    });

    const handleSubmit = (data: PolicyInputs) => {
        onSubmit(data.name);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Leave Policy</DialogTitle>
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
                                        <Input placeholder="Enter leave policy name" {...field} />
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