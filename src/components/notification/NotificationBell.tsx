import React from "react";
import {Button} from "@/components/ui/button";
import {Bell} from "lucide-react";
import {useNotifications} from "@/hooks/useNotifications.ts";
import {NotificationPanel} from "@/components/notification/NotificationPanel.tsx";

export const NotificationBell: React.FC = () => {
    const {unreadCount, isOpen, toggleNotificationPanel, markAsRead, markAllAsRead, notifications} = useNotifications();

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotificationPanel}
                className="h-8 w-8 text-gray-500 hover:text-gray-600 relative"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5"/>
                {unreadCount > 0 && (
                    <span
                        className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <NotificationPanel
                    notifications={notifications}
                    onClose={toggleNotificationPanel}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                />
            )}
        </div>
    );
};