import { UserResponse } from "@/core/types/user.ts";

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SLACK = 'SLACK'
}

export enum NotificationTriggerStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  ARCHIVED = 'ARCHIVED'
}

export enum EventType {
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  USER_CREATED = 'USER_CREATED',
  LEAVE_CREATED = 'LEAVE_CREATED',
  LEAVE_STATUS_UPDATED = 'LEAVE_STATUS_UPDATED',
  TEAM_CREATED = 'TEAM_CREATED',
  NOTIFICATION_CREATED = 'NOTIFICATION_CREATED'
}

export enum NotificationReceptor {
    USER = 'USER',
    TEAM_ADMIN = 'TEAM_ADMIN',
    ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
    ALL_TEAM_MEMBERS = 'ALL_TEAM_MEMBERS',
    REVIEWERS = 'REVIEWERS'
}


export interface NotificationTrigger {
  id: number;
  eventType: EventType;
  name:string;
  title:string;
  textTemplate:string;
  htmlTemplate:string;
  channels: NotificationChannel[];
  receptors: NotificationReceptor;
  status: NotificationTriggerStatus;
}

export interface NotificationTriggerCreateRequest {
    title: string;
    name: string;
    textTemplate: string;
    htmlTemplate: string;
    eventType: EventType;
    channels: NotificationChannel[];
    receptors: NotificationReceptor;
}

export interface NotificationFilterRequest {
    eventType?: EventType;
    channel?: NotificationChannel[];
    startDate?: string;
    endDate?: string;
}

export interface Notification {
    id: number;
    title: string,
    user: UserResponse;
    trigger: NotificationTrigger;
    textContent: string;
    htmlContent: string;
    event: EventType;
    params: Record<string, any>;
    channels: NotificationChannel[];
    sentAt: string;
    status: NotificationStatus;
}

export enum NotificationStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    READ = "READ"
}

export interface NotificationsCountResponse {
    unreadCount: number;
    totalCount: number
}

export interface EventSchema {
    name: string;
    description: string;
    schema: SchemaObject;
    receptors: NotificationReceptor[];
}

export interface SchemaObject {
    type: string;
    properties?: FieldSchema[];
}

export interface FieldSchema {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    enumValues?: string[];
    properties?: FieldSchema[];
    items?: ItemSchema;
}

export interface ItemSchema {
    type: string;
    enumValues?: string[];
    properties?: FieldSchema[];
}

export interface NotificationTriggerUpdateRequest {
    title: string
    name: string;
    textTemplate: string;
    htmlTemplate: string;
    eventType: EventType;
    channels: NotificationChannel[];
    receptors: NotificationReceptor
}