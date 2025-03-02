import {EventType, NotificationChannel, NotificationStatus} from "@/core/types/enum.ts";

export type PagedResponse<T> = {
    contents: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalContents: number
}

export type Country = {
    name: string;
    code: string
}

export interface Notification {
    id: number;
    user: {
        id: number;
        name: string;
    };
    title: string;
    description?: string;
    date: string;
    status: NotificationStatus;
    event: EventType;
    channel: NotificationChannel;
}