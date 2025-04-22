import { PagedResponse } from '../types/common';
import {
    EventSchema,
    Notification,
    NotificationFilterRequest,
    NotificationTrigger,
    NotificationTriggerCreateRequest,
    NotificationTriggerUpdateRequest,
    NotificationsCountResponse
} from '@/core/types/notifications.ts';
import fetchClient from "@/core/services/httpService.ts";

const baseURL = '/v1/notifications';

export async function getNotificationTriggers(): Promise<NotificationTrigger[]> {
    return await fetchClient.get(`${baseURL}/triggers`);
}

export async function createNotificationTrigger(payload: NotificationTriggerCreateRequest): Promise<NotificationTrigger> {
    return await fetchClient.post(`${baseURL}/triggers`, payload);
}

export async function getNotifications(filter: NotificationFilterRequest = {}, page: number = 0, size: number = 10): Promise<PagedResponse<Notification>> {
    const queryObject: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
        ...(filter.eventType ? { eventType: filter.eventType } : {}),
        ...(filter.startDate ? { startDate: filter.startDate } : {}),
        ...(filter.endDate ? { endDate: filter.endDate } : {}),
        ...(filter.channel && filter.channel.length > 0 ? { channel: filter.channel.join(",") } : {}),
    };

    const queryParams = new URLSearchParams(queryObject).toString();

    return await fetchClient.get(`${baseURL}?${queryParams}`);
}

export async function getNotificationEventSchemas(): Promise<EventSchema[]> {
    return await fetchClient.get(`${baseURL}/events`);
}

export async function deleteNotificationTrigger(id: number): Promise<void> {
    return await fetchClient.delete(`${baseURL}/triggers/${id}`);
}

export async function updateNotificationTrigger(payload: NotificationTriggerUpdateRequest, id: number): Promise<NotificationTrigger> {
    return await fetchClient.put(`${baseURL}/triggers/${id}`, payload);
}

export async function getNotificationTrigger(id: number): Promise<NotificationTrigger> {
    return await fetchClient.get(`${baseURL}/triggers/${id}`);
}

export async function getNotificationsCount(): Promise<NotificationsCountResponse> {
    return await fetchClient.get(`${baseURL}/count`);
}

export async function createNotificationRead(payload: number[]): Promise<NotificationsCountResponse> {
    return await fetchClient.post(`${baseURL}/read`, payload);
}