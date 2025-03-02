import {useEffect, useState} from "react";
import {Notification} from "@/core/types/common";
import {
    fetchNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from "@/components/notification/notificationService.ts";
import {NotificationStatus} from "@/core/types/enum.ts";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
                setUnreadCount(data.filter(n => n.status === "UNREAD").length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        getNotifications();
    }, []);

    const toggleNotificationPanel = () => {
        setIsOpen(!isOpen);
    };

    const markAsRead = async (id: number) => {
        await markNotificationAsRead(id);
        setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
                n.id === id ? {...n, status: NotificationStatus.READ} : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications((prevNotifications) =>
            prevNotifications.map((n) => ({...n, status: NotificationStatus.READ}))
        );
        setUnreadCount(0);
    };

    return {notifications, unreadCount, isOpen, toggleNotificationPanel, markAsRead, markAllAsRead};
};