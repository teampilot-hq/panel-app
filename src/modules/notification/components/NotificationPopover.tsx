import React, {useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Bell, Check, X} from "lucide-react";
import {Notification, NotificationStatus} from '@/core/types/notifications.ts';
import {formatTimeAgo} from "@/core/utils/timeAgo.ts";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationPopover = ({notifications, onClose, onMarkAsRead, onMarkAllAsRead}: NotificationPanelProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification>();

    const handleNotificationClick = (notification: Notification) => {
        onMarkAsRead(notification.id);
        setSelectedNotification(notification);
        setDialogOpen(true);
    };

    const hasUnreadNotifications = notifications.some(n => n.status === NotificationStatus.SENT);

    return (
        <>
            <Card
                className={`absolute left-0 top-10 w-96 z-50 shadow-lg duration-200 overflow-hidden border-gray-200`}>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 p-3 bg-gray-50">
                    <div className="flex items-center gap-2 px-2">
                        <h2 className="text-md font-semibold">Notifications</h2>
                    </div>
                    <div className="flex items-center gap-1">
                        {hasUnreadNotifications && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="hover:bg-gray-200 rounded-full p-1.5 transition-colors text-blue-600"
                                            onClick={onMarkAllAsRead}
                                            aria-label="Mark all as read"
                                        >
                                            <Check className="h-4 w-4"/>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Mark all as read</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <button
                            className="hover:bg-gray-200 rounded-full p-1.5 transition-colors"
                            onClick={onClose}
                            aria-label="Close notifications"
                        >
                            <X className="h-4 w-4"/>
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="p-0 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-2">
                            <Bell className="h-10 w-10 text-gray-300 mb-2"/>
                            <p className="text-gray-500 font-medium">No notifications</p>
                            <p className="text-xs text-gray-400">We'll notify you when something important happens</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => {
                                const isUnread = notification.status === NotificationStatus.SENT;
                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <p className={`text-sm ${isUnread ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`}>{notification.title}</p>
                                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                                    <span>{formatTimeAgo(notification.sentAt)}</span>
                                                </div>
                                            </div>
                                            {isUnread && (<span className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1"></span>)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={() => {
                setDialogOpen(false);
            }}>
                {selectedNotification && (
                    <DialogContent className=''>
                        <DialogHeader>
                            <DialogTitle className="text-xl">{selectedNotification.trigger.name}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 max-h-[500px] overflow-auto">
                            <div className="bg-muted/50 p-3 rounded-md">
                                <p className="text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>{selectedNotification.textContent}</p>
                            </div>

                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                <p className="italic">{formatTimeAgo(selectedNotification.sentAt)}</p>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
};