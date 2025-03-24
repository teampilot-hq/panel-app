import {GetLeavesFilter, LeaveUpdateRequest} from "@/core/types/leave.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createLeave, getLeaves, updateLeavesStatus} from "@/core/services/leaveService.ts";

export function useLeaves(filter: GetLeavesFilter = {}, pageNumber: number = 0) {
    return useQuery({
        queryKey: ['leaves', pageNumber, filter],
        queryFn: () => getLeaves(filter, pageNumber),
    })
}

export function useCreateLeave() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLeave,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['leaves']});
            queryClient.setQueryData(['leave', data.id], data);
        },
    });
}

export function useUpdateLeaveStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({payload, id}: {payload: LeaveUpdateRequest, id: number}) =>
            updateLeavesStatus(payload, id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['leaves']});
            queryClient.setQueryData(['leave', data.id], data);
        },
    });
}