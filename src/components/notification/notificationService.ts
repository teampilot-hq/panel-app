import {Notification} from "@/core/types/common";
import {EventType, NotificationChannel, NotificationStatus} from "@/core/types/enum.ts";

// Example mock data simulating API response
const mockNotifications: Notification[] = [
    {
        id: 1,
        user: {id: 101, name: "John Doe"},
        title: "Leave Request Approved",
        description: "Your leave request has been approved.",
        date: "2024-02-10",
        status: NotificationStatus.UNREAD,
        event: EventType.LEAVE_STATUS_UPDATED,
        channel: NotificationChannel.EMAIL,
    },
    {
        id: 2,
        user: {id: 102, name: "Jane Smith"},
        title: "New Organization Created",
        description: "A new organization was successfully created.",
        date: "2024-02-09",
        status: NotificationStatus.READ,
        event: EventType.ORGANIZATION_CREATED,
        channel: NotificationChannel.SLACK,
    }
];

// Simulated function to fetch notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockNotifications), 500);
    });
};

// Simulated function to mark a notification as read
export const markNotificationAsRead = async (id: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockNotifications.forEach(notification => {
                if (notification.id === id) notification.status = NotificationStatus.READ;
            });
            resolve();
        }, 300);
    });
};

// Simulated function to mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockNotifications.forEach(notification => (notification.status = NotificationStatus.READ));
            resolve();
        }, 300);
    });
};