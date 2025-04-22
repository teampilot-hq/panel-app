import {AuthenticationResponse, LoginRequest, RegistrationRequest} from "@/core/types/authentication.ts";
import fetchClient from "./httpService.ts";

const baseURL = '/auth';

export async function signup(payload: RegistrationRequest): Promise<AuthenticationResponse> {
    return await fetchClient.post(`${baseURL}/register`, payload);
}

export async function signin(data: LoginRequest): Promise<AuthenticationResponse> {
    return await fetchClient.post(`${baseURL}/login`, data);
}

export async function sendGeneratedPasswordEmail(email: string): Promise<void> {
    return await fetchClient.post(`${baseURL}/forget-password`, { email });
}