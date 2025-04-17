import {createUser, deleteUser, getUsers, getUser, updateUser, updateUserPassword, createAssets} from "@/core/services/userService.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ChangePasswordRequest, UserCreateRequest, UserResponse, UserUpdateRequest} from "@/core/types/user.ts";
import {PagedResponse} from "@/core/types/common.ts";
import {AssetResponse} from "@/core/types/user.ts";

export function useUsers(pageNumber: number = 0, pageSize: number = 100) {
    return useQuery<PagedResponse<UserResponse>>({
        queryKey: ['users', pageNumber, pageSize],
        queryFn: () => getUsers(pageNumber, pageSize),
    });
}

export function useUser(userId: string = 'mine') {
    return useQuery<UserResponse>({
        queryKey: ['user', userId],
        queryFn: () => getUser(userId),
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UserCreateRequest) => createUser(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });
}

export function useUpdateUser(userId: string = 'mine') {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UserUpdateRequest) => updateUser(userId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', userId] })
    });
}

export function useUpdateUserPassword(id: number) {
    return useMutation({
        mutationFn: (payload: ChangePasswordRequest) => updateUserPassword(payload, id),
    });
}

export function useUploadAssets() {
    return useMutation({
        mutationFn: ({ bucket, files }: { bucket: string; files: File[] }): Promise<AssetResponse[]> => createAssets(bucket, files),
    });
}