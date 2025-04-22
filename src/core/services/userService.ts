import {
    AssetResponse,
    ChangePasswordRequest,
    UserCreateRequest,
    UserResponse,
    UserUpdateRequest
} from "@/core/types/user.ts";
import { PagedResponse } from '@/core/types/common.ts';
import fetchClient from "@/core/services/httpService.ts";

const baseURL = '/users';

export async function createUser(payload: UserCreateRequest): Promise<UserResponse> {
    return await fetchClient.post(baseURL, payload);
}

export async function getUsers(pageNumber: number, pageSize: number = 20): Promise<PagedResponse<UserResponse>> {
    return await fetchClient.get(`${baseURL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export async function getUser(userId: string = 'mine'): Promise<UserResponse> {
    return await fetchClient.get(`${baseURL}/${userId}`);
}

export async function deleteUser(id: string) {
    return await fetchClient.delete(`${baseURL}/${id}`);
}

export async function updateUser(userId: string = 'mine', payload: UserUpdateRequest): Promise<UserResponse> {
    return await fetchClient.patch(`${baseURL}/${userId}`, payload);
}

export async function updateUserPassword(payload: ChangePasswordRequest, id: number) {
    return await fetchClient.patch(`${baseURL}/${id}/password`, payload);
}

export async function createAssets(bucket: string, files: File[]): Promise<AssetResponse[]> {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const query = new URLSearchParams({ bucket }).toString();
    return await fetchClient.post(`/assets?${query}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}