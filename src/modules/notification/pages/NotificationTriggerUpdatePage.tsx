import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Card, CardContent} from '@/components/ui/card';
import {toast} from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {getErrorMessage} from '@/core/utils/errorHandler';
import {PageSection} from '@/components/layout/PageSection.tsx';
import NotificationTriggerForm, {TriggerInputs} from "@/modules/notification/components/NotificationTriggerForm.tsx";
import {useNotificationEventSchemas, useNotificationTrigger, useUpdateNotificationTrigger} from "@/core/stores/notificationStore.ts";

export default function NotificationTriggerUpdatePage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const {data: trigger} = useNotificationTrigger(Number(id));
    const {data: eventSchemas} = useNotificationEventSchemas();
    const updateTriggerMutation = useUpdateNotificationTrigger(Number(id));


    const onSubmit = async (data: TriggerInputs) => {
        if (!trigger?.id) return;

        setIsProcessing(true);
        updateTriggerMutation.mutate(
            {
                title: data.title,
                name: data.name,
                textTemplate: data.textTemplate,
                htmlTemplate: data.htmlTemplate,
                eventType: data.eventType,
                channels: data.channels,
                receptors: data.receptors,
            },
            {
                onSuccess: () => {
                    toast({title: 'Success', description: 'Notification trigger updated successfully!',});
                    navigate('/notifications/triggers');
                },
                onError: (error) => {
                    toast({title: 'Error', description: getErrorMessage(error), variant: 'destructive',});
                },
                onSettled: () => {
                    setIsProcessing(false);
                }
            }
        );
    };

    if(!eventSchemas || !trigger) {
        return (<div>Loading ...</div>);
    }

    return (
        <>
            <PageHeader backButton='/notifications/triggers' title="Update Notification Trigger"/>
            <PageContent>
                <PageSection title='Trigger Configuration'
                             description="Set up the conditions and delivery settings for your notification trigger."/>

                <Card className="mx-auto">
                    <CardContent className='p-6'>
                        <NotificationTriggerForm
                            pageTitle={'Update'}
                            trigger = {trigger}
                            onSubmit={onSubmit}
                            isProcessing={isProcessing}
                            eventSchemas = {eventSchemas}
                        />
                    </CardContent>
                </Card>
            </PageContent>
        </>
    );
}