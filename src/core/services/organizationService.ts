import { OrganizationResponse, OrganizationUpdateRequest } from "@/core/types/organization.ts";
import fetchClient from "@/core/services/httpService.ts";

const baseURL = '/organizations';

export async function getOrganization(): Promise<OrganizationResponse> {
    return await fetchClient.get(`${baseURL}/default`);
}

export async function updateOrganization(payload: OrganizationUpdateRequest): Promise<OrganizationResponse> {
    return await fetchClient.put(`${baseURL}/default`, payload);
}