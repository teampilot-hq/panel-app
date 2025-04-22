import fetchClient from "@/core/services/httpService.ts";
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
    const queryObject: Record<string, string> = {
        pageNumber: pageNumber.toString(),
        ...(filter.teamId !== undefined ? { teamId: filter.teamId.toString() } : {}),
        ...(filter.userId !== undefined ? { userId: filter.userId.toString() } : {}),
        ...(filter.status !== undefined ? { status: filter.status } : {}),
    };

    const queryParams = new URLSearchParams(queryObject).toString();

    return await fetchClient.get(`${baseURL}?${queryParams}`);
}

export async function getLeavesBalance(userId: number | null = null): Promise<UserLeaveBalanceResponse[]> {
    return await fetchClient.get(`${baseURL}/${userId ? userId : 'mine'}/balance`);
}

export async function updateLeavesStatus(payload: LeaveUpdateRequest, id: number): Promise<LeaveResponse> {
    return await fetchClient.put(`${baseURL}/${id}`, payload);
}

export async function createLeave(payload: LeaveCreateRequest): Promise<LeaveResponse> {
    return await fetchClient.post(baseURL, payload);
}

export async function getLeavesPolicies(): Promise<LeavePolicyResponse[]> {
    return await fetchClient.get(`${baseURL}/policies`);
}

export async function getLeavesPolicy(id: number): Promise<LeavePolicyResponse> {
    return await fetchClient.get(`${baseURL}/policies/${id}`);
}

export async function createLeavesPolicy(payload: LeavePolicyCreateRequest): Promise<LeavePolicyResponse> {
    return await fetchClient.post(`${baseURL}/policies`, payload);
}

export async function deleteLeavePolicy(id: number) {
    return await fetchClient.delete(`${baseURL}/policies/${id}`);
}

export async function updateLeavePolicy(payload: LeavePolicyUpdateRequest, id: number): Promise<LeavePolicyResponse> {
    return await fetchClient.put(`${baseURL}/policies/${id}`, payload);
}

export async function getLeavesTypes(): Promise<LeaveTypeResponse[]> {
    return await fetchClient.get(`${baseURL}/types`);
}

export async function deleteLeaveType(id: number) {
    return await fetchClient.delete(`${baseURL}/types/${id}`);
}

export async function updateLeaveType(payload: LeaveTypeUpdateRequest, id: number): Promise<LeaveTypeResponse> {
    return await fetchClient.put(`${baseURL}/types/${id}`, payload);
}

export async function createLeavesType(payload: LeaveTypeCreateRequest): Promise<LeaveTypeResponse> {
    return await fetchClient.post(`${baseURL}/types`, payload);
}

export async function createLeavesCheck(payload: LeaveCheckRequest): Promise<LeaveCheckResponse> {
    return await fetchClient.post(`${baseURL}/check`, payload);
}