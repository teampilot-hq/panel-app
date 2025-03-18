import {UserRole, UserStatus} from "@/core/types/enum.ts";
import {OrganizationCompactResponse} from "@/core/types/organization.ts";
import {TeamCompactResponse} from "@/core/types/team.ts";
import {LeavePolicyCompactResponse} from "@/core/types/leave.ts";

export type UserCreateRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    timezone: string;
    country: string;
    teamId: number;
    leavePolicyId: number;
    joinedAt: string
}

export type UserUpdateRequest = {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    avatarAssetId?: number;
    leavePolicyId?: number;
    teamId?: number;
    role?: UserRole;
    joinedAt?: string
}

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string
}

export type UserResponse = {
    id: number;
    status: UserStatus;
    role: UserRole;
    email: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    team: TeamCompactResponse;
    timezone: string | null;
    country: string | null;
    organization: OrganizationCompactResponse;
    avatar: AssetResponse;
    leavePolicy: LeavePolicyCompactResponse;
    joinedAt: string;
    createdAt: string;
    updatedAt: string
}

export type AssetResponse = {
    id: number;
    size: number;
    name: string
    contentType: string;
    url: string;
    category: string;
}