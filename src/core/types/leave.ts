import {UserResponse} from "@/core/types/user.ts";
import {LeaveStatus, LeaveTypeCycle, LeaveTypeStatus} from "@/core/types/enum.ts";
import {HolidayResponse} from "@/core/types/holiday.ts";

export type LeaveUpdateRequest = {
    status: LeaveStatus;
}

export type LeaveCreateRequest = {
    typeId: number;
    start: string;
    end: string;
    reason?: string | null
}

export type LeaveResponse = {
    id: number;
    createdAt: string;
    updatedAt: string;
    startAt: string;
    endAt: string;
    status: LeaveStatus;
    duration: number;
    activatedType: LeavePolicyActivatedTypeResponse;
    policy: LeavePolicyCompactResponse;
    reason: string;
    user: UserResponse
}

export type LeaveTypeCreateRequest = {
    name: string;
    cycle: LeaveTypeCycle;
    amount: number;
    requiresApproval: boolean;
    symbol: string;
}

export enum ApprovalMode {
    ALL = 'ALL',
    ANY = "ANY"
}

export type LeaveTypeResponse = {
    id: number;
    name: string;
    cycle: LeaveTypeCycle;
    status: LeaveTypeStatus;
    symbol: string;
    amount: number;
    requiresApproval: boolean;
}

export type LeavePolicyCreateRequest = {
    name: string;
    status: LeavePolicyStatus;
    activatedTypes: LeavePolicyActivatedTypeRequest[];
    teamApprovers?: string[];
    approvalMode?: ApprovalMode;
}

export enum LeavePolicyStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}

export type LeavePolicyActivatedTypeRequest = {
    typeId: number;
    amount: number;
    requiresApproval: boolean;
}

export type LeavePolicyResponse = {
    id: number;
    name: string;
    activatedTypes: LeavePolicyActivatedTypeResponse[];
    isDefault: boolean;
    teamApprovers?: string[];
    approvalMode?: ApprovalMode;
}

export type LeavePolicyActivatedTypeResponse = {
    policyId: number;
    typeId: number;
    name: string;
    symbol: string;
    cycle: LeaveTypeCycle;
    amount: number;
    requiresApproval: boolean;
    status: LeaveTypeStatus;
}

export type LeavePolicyCompactResponse = {
    id: number;
}

export type UserLeaveBalanceResponse = {
    activatedType: LeavePolicyActivatedTypeResponse;
    usedAmount: number;
    totalAmount: number;
    startedAt: string;
}

export interface GetLeavesFilter {
    teamId?: number;
    userId?: number;
    status?: LeaveStatus;
}

export interface LeaveTypeUpdateRequest {
    name: string;
    cycle: LeaveTypeCycle;
    symbol: string;
    amount: number;
    requiresApproval: boolean;
}

export type LeavePolicyUpdateRequest = {
    name: string;
    status: LeavePolicyStatus;
    activatedTypes: LeavePolicyActivatedTypeRequest[];
    teamApprovers?: string[];
    approvalMode?: ApprovalMode;
}

export type LeaveCheckRequest = {
    typeId: number;
    start: string;
    end: string;
}

export type LeaveCheckResponse = {
    isAllowed: boolean;
    message: string;
    duration: number;
    totalDays: number;
    yourConflicts: LeaveResponse[];
    teamConflicts: LeaveResponse[];
    holidays: HolidayResponse[];
}