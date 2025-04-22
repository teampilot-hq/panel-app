import fetchClient from "./httpService";
import {
    FetchedPublicHoliday,
    HolidayOverviewResponse,
    HolidayResponse,
    HolidaysCreateRequest
} from "@/core/types/holiday.ts";

const baseURL = '/holidays';

export async function getHolidaysOverview(): Promise<HolidayOverviewResponse[]> {
    return await fetchClient.get(baseURL);
}

export async function getHolidays(year: number, countryCode: string): Promise<HolidayResponse[]> {
    return await fetchClient.get(`${baseURL}/${countryCode}/${year}`);
}

export async function fetchHolidays(year: number, countryCode: string): Promise<FetchedPublicHoliday[]> {
    const queryParams = new URLSearchParams({
        year: year.toString(),
        countryCode
    }).toString();

    return await fetchClient.get(`${baseURL}/fetch?${queryParams}`);
}

export async function createHolidays(payload: HolidaysCreateRequest[]): Promise<HolidayResponse> {
    return await fetchClient.post(`${baseURL}/batch`, payload);
}