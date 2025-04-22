import { TeamCreateRequest, TeamResponse } from "@/core/types/team.ts";
import fetchClient from "@/core/services/httpService.ts";

const baseURL = '/teams';

export async function getTeams(): Promise<TeamResponse[]> {
    return await fetchClient.get(baseURL);
}

export async function createTeam(payload: TeamCreateRequest): Promise<TeamResponse> {
    return await fetchClient.post(baseURL, payload);
}

export async function deleteTeam(id: number) {
    return await fetchClient.delete(`${baseURL}/${id}`);
}

export async function updateTeam(payload: TeamCreateRequest, id: number): Promise<TeamResponse> {
    return await fetchClient.put(`${baseURL}/${id}`, payload);
}