import { NotificationChannel } from "@/core/types/notifications";
import { Badge } from "@/components/ui/badge";
import { Mail, Slack } from "lucide-react";
import React from "react";

interface NotificationChannelBadgeProps {
    channels: NotificationChannel[];
}

export default function NotificationChannelBadge({ channels }: NotificationChannelBadgeProps) {
    const getChannelBadge = (channel: NotificationChannel) => {
        switch (channel) {
            case NotificationChannel.EMAIL:
                return (
                    <Badge key={channel} variant="secondary" className="text-xs flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                    </Badge>
                );
            case NotificationChannel.SLACK:
                return (
                    <Badge key={channel} variant="secondary" className="text-xs flex items-center gap-1">
                        <Slack className="h-3 w-3" /> Slack
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <p className="text-sm text-gray-700 w-fit flex gap-2">
            {channels.map((ch) => getChannelBadge(ch))}
        </p>
    );
}