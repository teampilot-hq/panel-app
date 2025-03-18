import {NotificationStatus} from "@/core/types/notifications.ts";
import {Check, CheckCheck, Clock, X} from "lucide-react";
import React from "react";

interface NotificationStatusIconProps {
    status: NotificationStatus;
}

export default function NotificationStatusIcon({status}: NotificationStatusIconProps) {
    const getStatusIcon = (status: NotificationStatus) => {
        switch (status) {
            case NotificationStatus.SENT:
                return <Check className="h-4 w-4 text-blue-600"/>;
            case NotificationStatus.FAILED:
                return <X className="h-4 w-4 text-red-600"/>;
            case NotificationStatus.PENDING:
                return <Clock className="h-4 w-4 text-amber-600"/>;
            case NotificationStatus.READ:
                return <CheckCheck className="h-4 w-4 text-green-600"/>;
        }
    };

    return (
        <span>{getStatusIcon(status)}</span>
    )
}