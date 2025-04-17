import React, {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Bell} from "lucide-react";
import {NotificationPopover} from "@/modules/notification/components/NotificationPopover.tsx";
import {useNotificationsCount} from "@/core/stores/notificationStore.ts";

export const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {data} = useNotificationsCount();
    const unreadCount = data?.unreadCount || 0;

    const toggleNotificationPanel = () => {
        setIsOpen(!isOpen);
    };

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
                <NotificationPopover
                    onClose={toggleNotificationPanel}
                />
            )}
        </div>
    );
};