import React, {useState} from 'react';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Bell, BellRing} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import {formatTimeAgo} from "@/core/utils/timeAgo.ts";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge.tsx";
import NotificationChannelBadge from "@/modules/notification/components/NotificationChannelBadge.tsx";
import NotificationStatusIcon from "@/modules/notification/components/NotificationStatusIcon.tsx";
import {useNotifications} from "@/core/stores/notificationStore.ts";

export default function NotificationsPage() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const navigate = useNavigate();

    const { data, isLoading, error } = useNotifications({}, 1, 10);
    const notifications = data?.contents ?? [];

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <>
            <PageHeader backButton='/settings' title="Notifications">
                <Button className='px-2 h-9' onClick={() => navigate('/notifications/triggers')}>
                    <BellRing className="h-4 w-4 mr-1"/>
                    Triggers
                </Button>
            </PageHeader>
            <PageContent>
                {error && (
                    <Alert variant="destructive" className="mb-4 max-w-4xl mx-auto">
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}

                <ScrollArea className="mx-auto">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <Collapsible
                                key={notification.id}
                                open={expandedId === notification.id}
                                onOpenChange={() => toggleExpand(notification.id)}
                                className="mb-3 border rounded-lg bg-white"
                            >
                                <CollapsibleTrigger
                                    className="text-left p-4 w-full hover:bg-gray-50 transition-colors cursor-pointer">
                                    <h3 className="flex items-center gap-3 mb-2 font-medium text-gray-900">
                                        {notification.title}
                                        <NotificationStatusIcon status={notification.status}/>
                                    </h3>
                                    <div className='flex items-center gap-3'>
                                        <Badge variant="outline" className="shrink-0 mt-1">
                                            <BellRing className="h-3 w-3 text-primary mr-1"/>
                                            {notification.trigger.name}
                                        </Badge>
                                        <NotificationChannelBadge channels={notification.channels}/>
                                        <div className="text-xs text-gray-500">{formatTimeAgo(notification.sentAt)}</div>
                                    </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="px-4 py-3 bg-gray-50 border-t">
                                    <Tabs defaultValue="text">
                                        <TabsList className="mb-3">
                                            <TabsTrigger value="text">Text Content</TabsTrigger>
                                            <TabsTrigger value="html">HTML Content</TabsTrigger>
                                            <TabsTrigger value="data">Notification Data</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="text">
                                            <div className="bg-white p-4 rounded border" style={{whiteSpace: "pre-line"}}>
                                                {notification.textContent}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="html">
                                            <div className="bg-white p-4 rounded border">
                                                <div dangerouslySetInnerHTML={{__html: notification.htmlContent}}/>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="data">
                                            <div className="bg-white p-4 rounded border">
                                                <pre className="text-xs overflow-auto max-h-96">
                                                    {JSON.stringify(notification.params, null, 2)}
                                                </pre>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    {notification.event === "LEAVE_CREATED" && (
                                        <div className="mt-4 flex justify-end">
                                            <Button size="sm" onClick={() => navigate(`/leaves/${notification.params?.leave?.id}`)}>
                                                Review Leave Request
                                            </Button>
                                        </div>
                                    )}
                                </CollapsibleContent>
                            </Collapsible>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                <Bell className="h-10 w-10 text-gray-400"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                            <p className="text-gray-500 max-w-md">
                                When notifications are sent from your triggers, they will appear here for you to review.
                            </p>
                            <Button variant="outline" className="mt-4" onClick={() => navigate('/notifications/triggers')}>
                                Set up triggers
                            </Button>
                        </div>
                    )}
                </ScrollArea>
            </PageContent>
        </>
    );
}