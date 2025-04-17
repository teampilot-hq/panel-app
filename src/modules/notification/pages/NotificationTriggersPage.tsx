import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Plus, Pencil, Trash} from 'lucide-react';
import {NotificationTrigger} from '@/core/types/notifications.ts';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import NotificationChannelBadge from "@/modules/notification/components/NotificationChannelBadge.tsx";
import {NotificationTriggerDeleteDialog} from "@/modules/notification/components/NotificationTriggerDeleteDialog.tsx";
import {useDeleteNotificationTrigger, useNotificationTriggers} from '@/core/stores/notificationStore';

export function NotificationTriggersPage() {
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTrigger, setSelectedTrigger] = useState<NotificationTrigger>();

    const {data: triggers = [], isLoading, isError, error} = useNotificationTriggers();
    const deleteNotificationTriggerMutation = useDeleteNotificationTrigger();

    const handleRemoveTrigger = async () => {
        if (!selectedTrigger) return;

        deleteNotificationTriggerMutation.mutate(selectedTrigger.id, {
            onSuccess: () => {
                toast({title: 'Success', description: 'Trigger removed successfully!', variant: 'default'});
            },
            onError: (error) => {
                toast({title: 'Error', description: getErrorMessage(error), variant: 'destructive'});
            },
            onSettled: () => {
                setIsDeleteDialogOpen(false);
                setSelectedTrigger(null);
            }
        });
    };

    return (
        <>
            <PageHeader backButton='/notifications' title="Notification Triggers">
                <Button className='px-2 h-9' onClick={() => navigate('/notifications/triggers/create')}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Create Trigger
                </Button>
            </PageHeader>
            <PageContent>

                {isError && error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{getErrorMessage(error)}</AlertDescription>
                    </Alert>
                )}

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event Type</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Receptors</TableHead>
                                    <TableHead>Channels</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {triggers.length ? (
                                    triggers.map((trigger) => (
                                        <TriggerRow
                                            key={trigger.id}
                                            trigger={trigger}
                                           openDeleteDialog={() => {
                                                setSelectedTrigger(trigger);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        />))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500">No notification trigger found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {isDeleteDialogOpen && selectedTrigger && (
                            <NotificationTriggerDeleteDialog
                                name="Notification Trigger"
                                label={selectedTrigger.name}
                                handleReject={() => setIsDeleteDialogOpen(false)}
                                handleAccept={handleRemoveTrigger}
                            />
                        )}
                    </Card>
                )}
            </PageContent>
        </>
    );
}

interface TriggerRowProps {
    trigger: NotificationTrigger;
    openDeleteDialog: () => void;
}

function TriggerRow({trigger, openDeleteDialog}: TriggerRowProps) {
    const navigate = useNavigate();
    const isArchived = trigger.status === "ARCHIVED";

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ENABLED':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'DISABLED':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <TableRow key={trigger.id} className={`${isArchived ? "opacity-50" : ""} hover:bg-muted/50 transition-colors`}>
            <TableCell>
                <Badge variant={'outline'}>{trigger.eventType}</Badge>
            </TableCell>
            <TableCell>{trigger.title}</TableCell>
            <TableCell>{trigger.name}</TableCell>
            <TableCell>
                <Badge variant={'outline'}>{trigger.receptors}</Badge>
            </TableCell>
            <TableCell>
                <NotificationChannelBadge channels={trigger.channels}/>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className={getStatusColor(trigger.status)}>{trigger.status}</Badge>
            </TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Button
                        className="px-1 hover:bg-muted/80 transition-colors"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/notifications/triggers/${trigger.id}`);
                        }}>
                        <Pencil className="h-4 text-muted-foreground"/>
                    </Button>
                    <Button
                        className="px-1 hover:bg-red-50 transition-colors"
                        variant="ghost"
                        size="sm"
                        onClick={openDeleteDialog}>
                        <Trash className="h-4 text-red-500"/>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}