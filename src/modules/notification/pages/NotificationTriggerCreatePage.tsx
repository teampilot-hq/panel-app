import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent} from '@/components/ui/card';
import {toast} from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {getErrorMessage} from '@/core/utils/errorHandler';
import {PageSection} from '@/components/layout/PageSection.tsx';
import NotificationTriggerForm, {TriggerInputs} from "@/modules/notification/components/NotificationTriggerForm.tsx";
import {useCreateNotificationTrigger, useNotificationEventSchemas} from "@/core/stores/notificationStore.ts";

export default function NotificationTriggerCreatePage() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: eventSchemas } = useNotificationEventSchemas();
    const createTriggerMutation = useCreateNotificationTrigger();

    const onSubmit = async (data: TriggerInputs) => {
        try {
            setIsProcessing(true);
            createTriggerMutation.mutate({
                title: data.title,
                name: data.name,
                textTemplate: data.textTemplate,
                htmlTemplate: data.htmlTemplate,
                eventType: data.eventType,
                channels: data.channels,
                receptors: data.receptors,
            });

            toast({
                title: 'Success',
                description: 'Notification trigger created successfully!',
            });
            navigate('/notifications/triggers');
        } catch (error) {
            toast({
                title: 'Error',
                description: getErrorMessage(error as Error),
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!eventSchemas) return <div>Loading...</div>;

    return (
        <>
            <PageHeader backButton='/notifications/triggers' title="Create Notification Trigger"/>
            <PageContent>
                <PageSection title='Trigger Configuration'
                             description="Set up the conditions and delivery settings for your notification trigger."/>

                <Card className="mx-auto">
                    <CardContent className='p-6'>
                        <NotificationTriggerForm
                            pageTitle='Create'
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