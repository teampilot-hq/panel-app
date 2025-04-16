import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    createLeavesType,
    deleteLeaveType,
    getLeavesBalance,
    getLeavesTypes,
    updateLeaveType
} from "@/core/services/leaveService.ts";
import {LeaveTypeCreateRequest, LeaveTypeUpdateRequest} from "@/core/types/leave.ts";


export function useLeaveTypes() {
    return useQuery({
        queryKey: ['leaveTypes'],
        queryFn: getLeavesTypes
    });
}

export function useCreateLeavesType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LeaveTypeCreateRequest) => createLeavesType(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
        }
    });
}

export function useUpdateLeaveType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, id }: { data: LeaveTypeUpdateRequest; id: number }) =>
            updateLeaveType(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
        }
    });
}

export function useDeleteLeaveType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteLeaveType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
        }
    });
}

export function useLeaveBalance(userId?: number | null) {
    return useQuery({
        queryKey: ['leaveBalance', userId ?? 'myLeaveBalance'],
        queryFn: () => getLeavesBalance(userId ?? null)
    });
}