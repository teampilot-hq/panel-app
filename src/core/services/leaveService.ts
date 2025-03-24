import axiosInstance from "@/core/services/httpService.ts";
import {
    GetLeavesFilter,
    LeaveCheckRequest,
    LeaveCheckResponse,
    LeaveCreateRequest,
    LeavePolicyCreateRequest,
    LeavePolicyResponse,
    LeavePolicyUpdateRequest,
    LeaveResponse,
    LeaveTypeCreateRequest,
    LeaveTypeResponse,
    LeaveTypeUpdateRequest,
    LeaveUpdateRequest,
    UserLeaveBalanceResponse
} from "@/core/types/leave.ts";
import {PagedResponse} from "@/core/types/common.ts";

const baseURL = '/leaves';

export async function getLeaves(filter: GetLeavesFilter = {}, pageNumber: number = 0): Promise<PagedResponse<LeaveResponse>> {
    const response = await axiosInstance.get(baseURL, {
        params: {...filter, pageNumber}
    });
    return response.data;
}

export async function createLeave(payload: LeaveCreateRequest): Promise<LeaveResponse> {
    const response = await axiosInstance.post(baseURL, payload);
    return response.data;
}

export async function updateLeavesStatus(payload: LeaveUpdateRequest, id: number): Promise<LeaveResponse> {
    const response = await axiosInstance.put(`${baseURL}/${id}`, payload);
    return response.data;
}

export async function getLeavesBalance(userId: number | null = null): Promise<UserLeaveBalanceResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/${userId ? userId : 'mine'}/balance`);
    return response.data;
}

export async function getLeavesPolicies(): Promise<LeavePolicyResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/policies`);
    return response.data;
}

export async function getLeavesPolicy(id: number): Promise<LeavePolicyResponse> {
    const response = await axiosInstance.get(`${baseURL}/policies/${id}`);
    return response.data;
}

export async function createLeavesPolicy(payload: LeavePolicyCreateRequest): Promise<LeavePolicyResponse> {
    const response = await axiosInstance.post(`${baseURL}/policies`, payload);
    return response.data;
}

export async function deleteLeavePolicy(id: number) {
    const response = await axiosInstance.delete(`${baseURL}/policies/${id}`);
    return response.data;
}

export async function updateLeavePolicy(payload: LeavePolicyUpdateRequest, id: number): Promise<LeavePolicyResponse> {
    const response = await axiosInstance.put(`${baseURL}/policies/${id}`, payload);
    return response.data;
}

export async function getLeavesTypes(): Promise<LeaveTypeResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/types`);
    return response.data;
}

export async function deleteLeaveType(id: number) {
    const response = await axiosInstance.delete(`${baseURL}/types/${id}`);
    return response.data;
}

export async function updateLeaveType(payload: LeaveTypeUpdateRequest, id: number): Promise<LeaveTypeResponse> {
    const response = await axiosInstance.put(`${baseURL}/types/${id}`, payload);
    return response.data;
}

export async function createLeavesType(payload: LeaveTypeCreateRequest): Promise<LeaveTypeResponse> {
    const response = await axiosInstance.post(`${baseURL}/types`, payload);
    return response.data;
}

export async function createLeavesCheck(payload: LeaveCheckRequest): Promise<LeaveCheckResponse> {
    const response = await axiosInstance.post(`${baseURL}/check`, payload);
    return response.data;
}