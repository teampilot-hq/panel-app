import {LeavePolicyCreateRequest, LeavePolicyUpdateRequest,} from "@/core/types/leave.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createLeavesPolicy, deleteLeavePolicy, getLeavesPolicies, getLeavesPolicy, updateLeavePolicy,} from "@/core/services/leaveService.ts";

export function useLeavesPolicies() {
    return useQuery({
        queryKey: ['leavesPolicies'],
        queryFn: getLeavesPolicies,
    })
}

export function useLeavesPolicy(policyId: number | null) {
    return useQuery({
        queryKey: ['leavesPolicy', policyId],
        queryFn: ()=> getLeavesPolicy(policyId),
        enabled: !!policyId,
    })
}

export function useCreateLeavesPolicy(payload: LeavePolicyCreateRequest) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ()=>createLeavesPolicy(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['leavesPolicy']});
            queryClient.setQueryData(['leavesPolicy', data.id], data);
        },
    });
}

export function useUpdateLeavePolicy(payload: LeavePolicyUpdateRequest, id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({payload, id}: {payload: LeavePolicyUpdateRequest, id: number}) => updateLeavePolicy(payload, id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['leavesPolicy']});
            queryClient.setQueryData(['leavesPolicy', data.id], data);
        },
    });
}

export function useDeleteLeavePolicy(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteLeavePolicy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['leavesPolicy']});
            queryClient.removeQueries({queryKey: ['leavesPolicy', id]});
        },
    });
}