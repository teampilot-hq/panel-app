import React from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {Notification} from "@/core/types/common";
import {Badge} from "@/components/ui/badge.tsx";

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationPanel = ({notifications, onClose, onMarkAsRead, onMarkAllAsRead}: NotificationPanelProps) => {
    const navigate = useNavigate();

    const handleNotificationClick = (notification: Notification) => {
        onMarkAsRead(notification.id);
        navigate("/");
        onClose();
    };

    return (
        <Card className="absolute left-0 top-10 w-96 z-50 shadow-lg animate-in fade-in-50 slide-in-from-top-5">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 p-0">
                <h2 className="text-lg font-semibold p-4">Notifications</h2>
                <button className='hover:bg-gray-50 p-2 m-2' onClick={onClose}>
                    <X className="h-4 w-4"/>
                </button>
            </CardHeader>

            <CardContent className="p-0 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No notifications</div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-baseline">
                                    {notification.status === "UNREAD" && (
                                        <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>)}
                                    <p className="text-sm text-gray-600">{notification.title}</p>
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <span>{notification.date}</span>
                                    <span className="mx-1">•</span>
                                    <Badge variant="outline">{notification.event}</Badge>
                                </div>
                                {notification.description && (
                                    <div
                                        className="mt-2 border-l-2 border-gray-300 pl-3 text-sm text-gray-700">{notification.description}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center p-2 border-t">
                {notifications.some((n) => n.status === "UNREAD") && (
                    <Button variant="ghost" onClick={onMarkAllAsRead}>Mark all as read</Button>
                )}
            </CardFooter>
        </Card>
    );
};