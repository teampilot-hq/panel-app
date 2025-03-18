import { PagedResponse } from '../types/common';
import axiosInstance from './httpService';
import {EventSchema, NotificationFilterRequest, NotificationTrigger, NotificationTriggerCreateRequest, Notification, NotificationsCountResponse, NotificationTriggerUpdateRequest
} from '@/core/types/notifications.ts';

const baseURL = '/v1/notifications';

async function getNotificationTriggers(): Promise<NotificationTrigger[]> {
    const response = await axiosInstance.get(`${baseURL}/triggers`);
    return response.data;
}

async function createNotificationTrigger(payload: NotificationTriggerCreateRequest): Promise<NotificationTrigger> {
    const response = await axiosInstance.post(`${baseURL}/triggers`, payload);
    return response.data;
}

async function getNotifications(payload: NotificationFilterRequest,page: number,size: number): Promise<PagedResponse<Notification>> {
    const response = await axiosInstance.get(`${baseURL}`, { params: { ...payload, page, size } });
    return response.data;
}

async function getNotificationEventSchemas() : Promise<EventSchema[]> {
    const response = await axiosInstance.get(`${baseURL}/events`);
    return response.data;
}

async function deleteNotificationTrigger(id:number) {
    const response = await axiosInstance.delete(`${baseURL}/triggers/${id}`);
    return response.data;
}

async function updateNotificationTrigger(payload: NotificationTriggerUpdateRequest, id: number): Promise<NotificationTrigger> {
    const response = await axiosInstance.put(`${baseURL}/triggers/${id}`, payload);
    return response.data;
}

async function getNotificationTrigger(id:number): Promise<NotificationTrigger> {
    const response = await axiosInstance.get(`${baseURL}/triggers/${id}`);
    return response.data;
}

async function getNotificationsCount() : Promise<NotificationsCountResponse> {
    const response = await axiosInstance.get(`${baseURL}/count`);
    return response.data;
}

async function createNotificationRead(payload: number[]): Promise<NotificationsCountResponse> {
    const response = await axiosInstance.post(`${baseURL}/read`, payload);
    return response.data;
}

export {getNotificationTriggers, createNotificationTrigger, getNotifications, getNotificationEventSchemas, deleteNotificationTrigger,getNotificationsCount, createNotificationRead, getNotificationTrigger, updateNotificationTrigger};
