import {Button} from "@/components/ui/button.tsx";
import {ChevronRight, Save, X} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import React, {useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {EventSchema, EventType, NotificationChannel, NotificationReceptor, NotificationTrigger} from "@/core/types/notifications.ts";
import {useNavigate} from "react-router-dom";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {toast} from "@/components/ui/use-toast.ts";
import {getVariablesFromSchema} from "@/modules/notification/utils/eventSchema.ts";
import FormItemInfo from "@/components/FormItemInfo.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

interface NotificationTriggerFormProps {
    onSubmit: (data: TriggerInputs) => void;
    isProcessing: boolean;
    eventSchemas: EventSchema[];
    trigger?: NotificationTrigger;
    pageTitle: string
}

const FormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    name: z.string().min(1, 'Name is required'),
    textTemplate: z.string().min(1, 'Text template is required'),
    htmlTemplate: z.string().min(1, 'HTML template is required'),
    eventType: z.nativeEnum(EventType, {errorMap: () => ({message: "Event type is required"})}),
    channels: z.array(z.nativeEnum(NotificationChannel)).min(1, 'Select at least one channel'),
    receptors: z.nativeEnum(NotificationReceptor, {errorMap: () => ({message: "Receptor is required"})}),
});

export type TriggerInputs = z.infer<typeof FormSchema>;

export default function NotificationTriggerForm({onSubmit, isProcessing, eventSchemas, trigger, pageTitle}: NotificationTriggerFormProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'text' | 'html'>('text');
    const [selectedEventSchema, setSelectedEventSchema] = useState<EventSchema | null>(
        trigger ? eventSchemas.find(value => value.name === trigger.eventType) : null
    );

    const form = useForm<TriggerInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            channels: trigger?.channels ?? [],
            receptors: trigger?.receptors,
            title: trigger?.title ?? '',
            name: trigger?.name ?? '',
            textTemplate: trigger?.textTemplate ?? '',
            htmlTemplate: trigger?.htmlTemplate ?? '',
            eventType: trigger?.eventType,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <NotificationTriggerCreateBasicInformation form={form}/>
                <NotificationTriggerCreateEventDetails form={form} eventSchemas={eventSchemas} setSelectedEventSchema={setSelectedEventSchema}/>
                <NotificationTriggerCreateTemplateContent form={form} activeTab={activeTab} setActiveTab={setActiveTab} selectedSchema={selectedEventSchema}/>
                <NotificationTriggerCreateDeliverySettings form={form} selectedEventSchema={selectedEventSchema}/>
                <div className="flex justify-end pt-4 border-t gap-4">
                    <Button variant="outline" onClick={() => navigate('/notifications/triggers')} disabled={isProcessing}>
                        <X className="w-4 h-4 mr-2"/>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                        <Save className="w-4 h-4 mr-2"/>
                        {isProcessing ? 'Processing...' : pageTitle}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

interface BasicInformationSectionProps {
    form: UseFormReturn<TriggerInputs>;
}

function NotificationTriggerCreateBasicInformation({form}: BasicInformationSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <Separator/>
            <FormField control={form.control} name="name" render={({field}) => (
                <div className={'grid grid-cols-2 gap-4'}>
                    <FormItem>
                        <FormLabel>
                            Name
                            <FormItemInfo title={'Provide a unique identifier for this notification trigger.'}/>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Enter trigger name" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                </div>
            )}/>
        </div>
    );
}

interface EventConfigurationProps {
    form: UseFormReturn<TriggerInputs>;
    eventSchemas: EventSchema[];
    setSelectedEventSchema: (schema: EventSchema | null) => void;
}

function NotificationTriggerCreateEventDetails({form, eventSchemas, setSelectedEventSchema}: EventConfigurationProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Details</h3>
            <Separator/>
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField control={form.control} name="title" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Title
                            <FormItemInfo title={'Specify a title to describe this notification.'}/>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Enter trigger title" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                <FormField
                    control={form.control}
                    name="eventType"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Event Type
                                <FormItemInfo title={'Choose the event that will initiate this notification trigger.'}/>
                            </FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    const schema = eventSchemas.find(s => s.name === value);
                                    setSelectedEventSchema(schema || null);
                                }}
                                value={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an event type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {eventSchemas.map((schema) => (
                                        <SelectItem key={schema.name} value={schema.name}>{schema.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}

interface TemplateContentProps {
    form: UseFormReturn<TriggerInputs>;
    activeTab: 'text' | 'html';
    setActiveTab: (tab: 'text' | 'html') => void;
    selectedSchema: EventSchema;
}

function NotificationTriggerCreateTemplateContent({form, activeTab, setActiveTab, selectedSchema}: TemplateContentProps) {
    const availableVariables = selectedSchema ? getVariablesFromSchema(selectedSchema.schema) : {};

    const copyVariables = () => {
        const allVariables = Object.values(availableVariables)
            .flat()
            .map((v) => v.name)
            .join("\n");
        navigator.clipboard.writeText(allVariables);
        toast({
            title: "Copied",
            description: "Variables copied to clipboard",
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Template Content</h3>
            <Separator/>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'html')}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="text">Text Template</TabsTrigger>
                            <TabsTrigger value="html">HTML Template</TabsTrigger>
                        </TabsList>
                        <FormItemInfo title={'Define the message content for different delivery formats.'}/>

                        <div className="space-y-4">
                            {activeTab === 'text' && (
                                <FormField
                                    control={form.control}
                                    name="textTemplate"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea placeholder="Enter text template content..."
                                                          className="min-h-[400px] font-mono"{...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )}
                            {activeTab === 'html' && (
                                <FormField
                                    control={form.control}
                                    name="htmlTemplate"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea placeholder="Enter HTML template content..."
                                                          className="min-h-[400px] font-mono"{...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </Tabs>
                </div>

                <div className="lg:col-span-2 space-y-4 lg:pl-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center mt-3">
                            <h4 className="font-medium">Available Variables</h4>
                            <FormItemInfo
                                title={'Explore available dynamic variables based on the selected event type.'}/>
                        </div>
                        <Button variant="outline" className="h-7"
                                onClick={(e) => {
                                    e.preventDefault();
                                    copyVariables();
                                }}
                        >Copy</Button>
                    </div>

                    {!selectedSchema ? (
                        <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/10">
                            <p className="text-sm text-muted-foreground px-2">Select an event type to see available variables</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[400px] border rounded-md p-2">
                            <div className="space-y-1 font-mono text-sm">
                                {Object.entries(availableVariables).map(([category, variables]) => (
                                    <div key={category}>
                                        <div className="flex items-center py-2">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0"/>
                                            <span className="font-semibold ml-1">{category}</span>
                                            <Badge variant="outline" className="ml-2 text-xs">{variables.length}</Badge>
                                        </div>
                                        <div className="ml-4 border-l pl-3 space-y-1">
                                            {variables.map((variable) => (
                                                <div key={variable.name}
                                                     className="flex items-center py-1 hover:bg-muted/50 rounded pl-2 cursor-pointer group">
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <span
                                                            className="text-blue-600 dark:text-blue-400">{variable.name}</span>
                                                        <span
                                                            className="text-muted-foreground text-xs">{variable.type}</span>
                                                        {variable.required && (<span
                                                            className="text-[10px] text-orange-500">required</span>)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>
    );
}

interface DeliveryConfigurationProps {
    form: UseFormReturn<TriggerInputs>;
    selectedEventSchema: EventSchema | null;
}

function NotificationTriggerCreateDeliverySettings({form, selectedEventSchema}: DeliveryConfigurationProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Settings</h3>
            <Separator/>
            <div className="grid grid-cols-2 gap-6 justify-between w-full">
                <FormField
                    control={form.control}
                    name="receptors"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Receptors
                                <FormItemInfo
                                    title={'Define the recipients for this notification, depending on the event type.'}/>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedEventSchema}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select receptor type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedEventSchema?.receptors.map((receptor) => (
                                        <SelectItem key={receptor} value={receptor}>{receptor}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="channels"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notification Channels
                                <FormItemInfo title="Select the channels where this notification will be delivered."/>
                            </FormLabel>
                            <div className="flex flex-wrap flex-row gap-3">
                                {Object.values(NotificationChannel).map((channel) => {
                                    const isSelected = field.value.includes(channel);
                                    return (
                                        <Button
                                            key={channel}
                                            type="button"
                                            variant={isSelected ? "secondary" : "outline"}
                                            className="gap-2"
                                            onClick={() => {
                                                const newValue = isSelected
                                                    ? field.value.filter((c) => c !== channel)
                                                    : [...field.value, channel];
                                                field.onChange(newValue);
                                            }}
                                        >
                                            {channel}
                                        </Button>
                                    );
                                })}
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}