import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom';
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import {Card} from "@/components/ui/card.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import {useCreateTeam, useTeams} from "@/core/stores/teamStore.ts";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "team Name must be over 2 characters"
    }).max(20, {
        message: "team Name must be under 20 characters"
    }),
});

type CreateTeamInputs = z.infer<typeof FormSchema>;

export default function TeamCreatePage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const {data: teams} = useTeams();
    const createTeamMutation = useCreateTeam();

    const form = useForm<CreateTeamInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (data: CreateTeamInputs) => {
        createOrganizationTeam(data);
    };

    const createOrganizationTeam = (data: CreateTeamInputs) => {
        const exists = teams.some(t => t.name === data.name);

        if (exists) {
            setErrorMessage('A team already exists with this name.');
            return;
        }

        const payload = {
            name: data.name,
            metadata: {},
        };
        setIsProcessing(true);

        createTeamMutation.mutate(
            payload,
            {
                onSuccess: () => {
                    toast({title: "Success", description: "Team created successfully!"});
                    navigate('/teams');
                },
                onError: (error) => {
                    toast({title: "Error", description: getErrorMessage(error), variant: "destructive",});
                },
                onSettled: () => {
                    setIsProcessing(false);
                }
            }
        );
    };

    return (
        <>
            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <PageHeader title={"Create team"} backButton={"/teams"}></PageHeader>

            <PageContent>
                <Card className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-fit" disabled={isProcessing}>
                                {isProcessing ? 'Creating...' : 'Create'}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </PageContent>
        </>
    );
}