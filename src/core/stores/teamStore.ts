import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createTeam, deleteTeam, getTeams, updateTeam} from "@/core/services/teamService.ts";
import {TeamCreateRequest} from "@/core/types/team.ts";

export function useTeams() {
    return useQuery({
        queryKey: ['teams'],
        queryFn: getTeams
    });
}

export function useCreateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: TeamCreateRequest) => createTeam(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
    });
}

export function useUpdateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, id }: { data: TeamCreateRequest; id: number }) =>
            updateTeam(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
    });
}

export function useDeleteTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTeam(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
    });
}