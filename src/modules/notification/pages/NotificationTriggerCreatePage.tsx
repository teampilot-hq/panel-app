import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent} from '@/components/ui/card';
import {toast} from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {EventSchema} from '@/core/types/notifications.ts';
import {createNotificationTrigger, getNotificationEventSchemas} from '@/core/services/notificationService';
import {getErrorMessage} from '@/core/utils/errorHandler';
import {PageSection} from '@/components/layout/PageSection.tsx';
import NotificationTriggerForm, {TriggerInputs} from "@/modules/notification/components/NotificationTriggerForm.tsx";

export default function NotificationTriggerCreatePage() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [eventSchemas, setEventSchemas] = useState<EventSchema[]>(null);

    useEffect(() => {
        const fetchEventSchemas = async () => {
            try {
                const schemas = await getNotificationEventSchemas();
                setEventSchemas(schemas);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch event schemas",
                    variant: "destructive",
                });
            }
        };
        fetchEventSchemas();
    }, []);

    const onSubmit = async (data: TriggerInputs) => {
        try {
            setIsProcessing(true);
            await createNotificationTrigger({
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

    if(!eventSchemas) {
        return (<div>Loading ...</div>);
    }

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