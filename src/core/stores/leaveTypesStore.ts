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
    })
}

export function useCreateLeavesType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LeaveTypeCreateRequest) => createLeavesType(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['leaveTypes']});
            queryClient.setQueryData(['leaveTypes', data.id], data)
        }
    })
}

export function useUpdateLeaveType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({data, id}: {
            data: LeaveTypeUpdateRequest,
            id: number
        }) => updateLeaveType(data, id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['leaveTypes']});
            queryClient.setQueryData(['leaveTypes', data.id], data)
        },
    });
}

export function useDeleteLeaveType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteLeaveType(id),
        onSuccess: (id) => {
            queryClient.invalidateQueries({queryKey: ['leaveTypes']});
            queryClient.removeQueries({queryKey: ['leaveTypes', id]});
        },
    });
}

export function useLeaveBalance(userId?: number | null) {
    return useQuery({
        queryKey: ['leaveBalance', userId ?? 'mine'],
        queryFn: ()=> getLeavesBalance(userId ?? null)
    })
}