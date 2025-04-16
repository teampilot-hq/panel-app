import React, {useState} from 'react';
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {TeamResponse} from "@/core/types/team.ts";
import {Pencil, Plus, Trash} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import TeamUpdateDialog from "@/modules/team/components/TeamUpdateDialog.tsx";
import {DeleteModal} from "@/modules/team/components/TeamDeleteDialog.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import TeamCreateDialog from "@/modules/team/components/TeamCreateDialog.tsx";
import {useCreateTeam, useDeleteTeam, useTeams} from "@/core/stores/teamStore.ts";

export default function TeamsPage() {
    const [selectedTeamForUpdate, setSelectedTeamForUpdate] = useState<TeamResponse | null>(null);
    const [selectedTeamForDelete, setSelectedTeamForDelete] = useState<TeamResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const {data: teams} = useTeams();
    const createTeamMutation = useCreateTeam();
    const deleteTeamMutation = useDeleteTeam();

    const handleRemoveTeam = () => {
        if (!selectedTeamForDelete) return;

        setIsProcessing(true);
        deleteTeamMutation.mutate(selectedTeamForDelete.id, {
            onSuccess: () => {
                toast({ title: "Success", description: "Team removed successfully!" });
                setSelectedTeamForDelete(null);
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: getErrorMessage(error),
                    variant: "destructive",
                });
            },
            onSettled: () => {
                setIsProcessing(false);
            }
        });
    };

    const createOrganizationTeam = async (name: string) => {
        if (!teams) return;

        const exists = teams.some((t) => t.name === name);
        if (exists) {
            toast({title: "Error", description: "A team with this name already exists.", variant: "destructive",});
            return;
        }

        setIsProcessing(true);
        createTeamMutation.mutate(
            { name, metadata: {} },
            {
                onSuccess: () => {
                    toast({ title: "Success", description: "Team created successfully!" });
                    setIsCreateDialogOpen(false);
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
            <PageHeader title='Teams'>
                <Button className="px-2 h-9" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Create
                </Button>
            </PageHeader>
            <PageContent>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams?.map((t) => (
                                <TeamRowItem
                                    key={t.id}
                                    t={t}
                                    setSelectedTeamForUpdate={setSelectedTeamForUpdate}
                                    setSelectedTeamForDelete={setSelectedTeamForDelete}
                                    isProcessing={isProcessing}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    <TeamCreateDialog
                        isOpen={isCreateDialogOpen}
                        onClose={() => setIsCreateDialogOpen(false)}
                        teamList={teams}
                        onSubmit={(name) => createOrganizationTeam(name)}
                    />

                    {selectedTeamForUpdate && (
                        <TeamUpdateDialog
                            teamId={selectedTeamForUpdate.id}
                            teamName={selectedTeamForUpdate.name}
                            onClose={() => setSelectedTeamForUpdate(null)}
                        />
                    )}

                    {selectedTeamForDelete && (
                        <DeleteModal
                            team={selectedTeamForDelete}
                            handleReject={() => setSelectedTeamForDelete(null)}
                            handleAccept={handleRemoveTeam}
                        />
                    )}
                </Card>
            </PageContent>
        </>
    );
}

type TeamItemProps = {
    t: TeamResponse;
    isProcessing: boolean;
    setSelectedTeamForUpdate: (team: TeamResponse | null) => void;
    setSelectedTeamForDelete: (team: TeamResponse | null) => void;
};

function TeamRowItem({ t, isProcessing, setSelectedTeamForUpdate, setSelectedTeamForDelete }: TeamItemProps) {
    return (
        <TableRow className="hover:bg-gray-50 transition-colors">
            <TableCell>{t.name}</TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Button
                        className="h-8 w-8 p-0"
                        variant="ghost"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setSelectedTeamForUpdate(t)}
                    >
                        <Pencil className="h-4 text-gray-600"/>
                    </Button>

                    <Button
                        className="h-8 w-8 p-0"
                        variant="ghost"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setSelectedTeamForDelete(t)}
                    >
                        <Trash className="h-4 text-red-500"/>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}