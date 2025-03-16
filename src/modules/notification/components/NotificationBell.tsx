import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Bell} from "lucide-react";
import {NotificationPopover} from "@/modules/notification/components/NotificationPopover.tsx";
import {getNotificationsCount} from "@/core/services/notificationService.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {toast} from "@/components/ui/use-toast.ts";

export const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        fetchNotificationsCount();
    }, []);

    const fetchNotificationsCount = async () => {
        try {
            const response = await getNotificationsCount();
            setUnreadCount(response.unreadCount);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive",});
        }
    };

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
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <NotificationPopover
                    setUnreadCount = {setUnreadCount}
                    onClose={toggleNotificationPanel}
                />
            )}
        </div>
    );
};