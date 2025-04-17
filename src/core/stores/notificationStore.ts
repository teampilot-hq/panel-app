import {useQuery, useMutation, useQueryClient, UseQueryOptions} from '@tanstack/react-query';
import {getNotificationTriggers, createNotificationTrigger, getNotifications, getNotificationEventSchemas, deleteNotificationTrigger, updateNotificationTrigger, getNotificationTrigger, getNotificationsCount, createNotificationRead,} from '@/core/services/notificationService';
import {NotificationFilterRequest, NotificationTriggerCreateRequest, NotificationTriggerUpdateRequest,} from '@/core/types/notifications';

export function useNotificationTriggers() {
    return useQuery({
        queryKey: ['notification-triggers'],
        queryFn: getNotificationTriggers,
    });
}

export function useNotificationTrigger(id: number) {
    return useQuery({
        queryKey: ['notification-trigger', id],
        queryFn: () => getNotificationTrigger(id),
        enabled: !!id,
    });
}

export function useNotificationEventSchemas() {
    return useQuery({
        queryKey: ['notification-event-schemas'],
        queryFn: getNotificationEventSchemas,
    });
}

export function useNotifications(filters: NotificationFilterRequest, page: number, size: number) {
    return useQuery({
        queryKey: ['notifications', filters, page],
        queryFn: () => getNotifications(filters, page, size),
    });
}

export function useNotificationsCount() {
    return useQuery({
        queryKey: ['notifications-count'],
        queryFn: getNotificationsCount,
    });
}

export function useCreateNotificationTrigger() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: NotificationTriggerCreateRequest) => createNotificationTrigger(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notification-triggers'] })
    });
}

export function useUpdateNotificationTrigger(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: NotificationTriggerUpdateRequest) => updateNotificationTrigger(payload, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification-triggers'] });
            queryClient.invalidateQueries({ queryKey: ['notification-trigger', id] });
        },
    });
}

export function useDeleteNotificationTrigger() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteNotificationTrigger(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notification-triggers'] })
    });
}

export function useCreateNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: number[]) => createNotificationRead(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
        },
    });
}