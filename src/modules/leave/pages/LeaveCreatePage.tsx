import React, {useContext, useEffect, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useLocation, useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {createLeave, createLeavesCheck, getLeaves, getLeavesPolicy} from "@/core/services/leaveService.ts";
import {getErrorMessage} from '@/core/utils/errorHandler.ts';
import DatePicker from '@/modules/leave/components/DatePicker';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {toast} from "@/components/ui/use-toast";
import {calculateWeekends, getNextWorkingDay, isDateInHoliday, isDateInWeekend} from "@/core/utils/date.ts";
import {getHolidays} from "@/core/services/holidayService";
import {HolidayResponse} from "@/core/types/holiday.ts";
import {UserContext} from "@/contexts/UserContext";
import {Week} from "@/core/types/enum.ts";
import {capitalizeFirstLetter} from "@/core/utils/string.ts";
import {LeaveCreateRequest, LeavePolicyActivatedTypeResponse, LeaveResponse} from "@/core/types/leave.ts";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import LeaveConflicts from "@/modules/leave/components/LeaveConflicts.tsx";
import {Send, X} from "lucide-react";

/*
1.Fetch LeavePolicyType name and id from leaves/policies
2.Fetch duration
3.Fetch post method for submit leave request form to /leaves
4.Restrict leave duration to Company Policy by limiting the range to the maximum allowed vacation length

-Calendar:
5.Fetch Holidays from /holidays for disabling in calendar
6.How to handle holidays if year changes
7.Calculate weekends by getting weekDays in organization in UserContext and disable weekends in calendar
8.Disable days before today for start (Start Date Cannot Be After End Date)
9.Disable days before start day for end date (End Date Cannot Be Before Start Date)
10.Start and end date is today date by default. if user changes start date, end date is as the same as start date by default.
 */

dayjs.extend(isBetween);

const FormSchema = z.object({
    leaveCategory: z.string().nonempty("Please select a valid leave type."),
    startDate: z.date(),
    endDate: z.date(),
    reason: z.string().optional(),
});

export default function LeaveCreatePage() {
    const [holidays, setHolidays] = useState<Date[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeavePolicyActivatedTypeResponse[]>([]);
    const [weekendsDays, setWeekendsDays] = useState<string[]>([]);
    const [userLeaves, setUserLeaves] = useState<LeaveResponse[]>([]);
    const [duration, setDuration] = useState<number>(0);
    const [totalLeaveDays, setTotalLeaveDays] = useState<number>(0);
    const [conflicts, setConflicts] = useState<LeaveResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {user, organization} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const goBack = () => {
        navigate(location.state?.from || "/");
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            leaveCategory: '',
            startDate: new Date(),
            endDate: new Date(),
            reason: '',
        },
    });

    const {handleSubmit, watch, setValue} = form;
    const startDate = watch('startDate');
    const endDate = watch('endDate');
    const leaveCategory = watch("leaveCategory");

    // Fetch leave policies
    const fetchLeavePolicies = async () => {
        try {
            if (!user || !user.leavePolicy?.id) {
                console.log("User or user.leavePolicy.id is not available");
                return
            }
            const userPolicy = await getLeavesPolicy(user?.leavePolicy?.id);
            if (userPolicy) {
                const types = userPolicy.activatedTypes;
                setLeaveTypes(types);
            } else {
                console.log("No matching policy found for the user.");
            }
        } catch (error) {
            console.log("Fetching leave Policy", error);
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    // Fetch holidays
    const fetchHolidays = async () => {
        try {
            const currentYear = new Date().getFullYear();
            const nextYear = currentYear + 1;
            const currentYearHolidays: HolidayResponse[] = await getHolidays(currentYear, user?.country);
            const nextYearHolidays: HolidayResponse[] = await getHolidays(nextYear, user?.country);
            const holidaysDates = [
                ...currentYearHolidays.map((holiday) => new Date(holiday.date)),
                ...nextYearHolidays.map((holiday) => new Date(holiday.date)),
            ];
            setHolidays(holidaysDates);
        } catch (error) {
            console.log("Fetching holidays", error);
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    // Adjust endDate if it's before startDate
    useEffect(() => {
        if (dayjs(endDate).isBefore(dayjs(startDate))) {
            setValue('endDate', startDate);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (!leaveCategory || !startDate) return;
        if (dayjs(endDate).isBefore(dayjs(startDate))) return;

        const fetchDuration = async () => {
            try {
                const response = await createLeavesCheck({
                    typeId: Number(leaveCategory),
                    start: dayjs(startDate).toISOString(),
                    end: dayjs(endDate).toISOString(),
                });
                setDuration(response.duration);
                setTotalLeaveDays(response.totalDays);
                setConflicts([...response.yourConflicts, ...response.teamConflicts]);
            } catch (error) {
                setDuration(null);
                const errorMessage = getErrorMessage(error as Error | string);
                setErrorMessage(errorMessage);
                toast({
                    title: "Error",
                    description: "Failed to fetch duration.",
                    variant: "destructive",
                });
            }
        };

        fetchDuration();
    }, [startDate, endDate, leaveCategory]);

    // Fetch user's leaves
    const fetchUserLeaves = async () => {
        try {
            if (!user) return;
            const leavesList = await getLeaves({userId: user.id});
            const filteredLeaves = leavesList.contents.filter(
                leave => leave.status === "ACCEPTED" || leave.status === "PENDING"
            );
            setUserLeaves(filteredLeaves);
        } catch (error) {
            console.log("Fetching user leaves", error);
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({
                title: "Error",
                description: "Failed to fetch user leaves.",
                variant: "destructive",
            });
        }
    };

    //Submit leave request form
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const selectedType = Number(data.leaveCategory);

            const payload: LeaveCreateRequest = {
                typeId: selectedType,
                start: dayjs(data.startDate).toISOString(),
                end: dayjs(data.endDate).toISOString(),
                reason: data.reason,
            };

            await createLeave(payload);
            console.log(payload);
            navigate('/leaves/pending');
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive"});
        }
    };

    // Fetch leave types, holidays, and user's leaves on mount
    useEffect(() => {
        fetchLeavePolicies();
        fetchHolidays();
        fetchUserLeaves();

        if (organization?.workingDays) {
            const weekends = calculateWeekends(organization.workingDays as Week[]);
            setWeekendsDays(weekends.map(day => capitalizeFirstLetter(day.toLowerCase())));
        }
    }, [organization?.workingDays]);

    // Adjust startDate if it's a weekend or holiday
    useEffect(() => {
        if (isDateInWeekend(startDate, weekendsDays) || isDateInHoliday(startDate, holidays)) {
            setValue("startDate", getNextWorkingDay(startDate, holidays, weekendsDays));
        }
    }, [holidays, startDate, weekendsDays]);

    return (
        <>
            <PageHeader title='Create Leave'/>
            <PageContent>
                <Card className="mx-auto">
                    <div className="p-6">
                        {errorMessage && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <LeaveTypeField form={form} leaveTypes={leaveTypes}/>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Leave Duration</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <DatePicker
                                            title="Start Date"
                                            handleDateSelected={(date: Date) => setValue('startDate', date)}
                                            selectedDate={startDate}
                                            daysBefore={new Date()}
                                            holidays={holidays}
                                            weekendsDays={weekendsDays}
                                        />
                                        <DatePicker
                                            title="End Date"
                                            handleDateSelected={(date: Date) => setValue('endDate', date)}
                                            selectedDate={endDate}
                                            daysBefore={startDate}
                                            holidays={holidays}
                                            weekendsDays={weekendsDays}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 border p-4 rounded-lg">
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground mb-1">Total Days</div>
                                            <div className="text-2xl font-semibold">{totalLeaveDays}</div>
                                        </div>
                                        <div className="text-center border-x">
                                            <div className="text-sm text-muted-foreground mb-1">Working Days</div>
                                            <div className="text-2xl font-semibold">{duration}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground mb-1">Non-Working Days</div>
                                            <div className="text-2xl font-semibold">
                                                {totalLeaveDays - duration}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {conflicts?.length > 0 && (
                                    <div className="">
                                        <LeaveConflicts conflicts={conflicts}/>
                                    </div>
                                )}

                                <ReasonField form={form}/>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={goBack} type="button" variant="outline" className="mr-2">
                                        <X className="w-4 h-4 mr-2"/>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        <Send className="w-4 h-4 mr-2"/>
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </Card>
            </PageContent>
        </>
    );
}

type FieldProps = {
    form: UseFormReturn;
    leaveTypes?: LeavePolicyActivatedTypeResponse[];
}

function LeaveTypeField({form, leaveTypes}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="leaveCategory"
            render={({field}) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-medium">Type</FormLabel>
                    <FormControl>
                        <div className="flex flex-wrap gap-2">
                            {leaveTypes?.map((type) => (
                                <Button
                                    key={type.typeId}
                                    type="button"
                                    variant={field.value === type.typeId.toString() ? "secondary" : "outline"}
                                    className={`
                                        px-3 h-10 flex items-center gap-3
                                        ${field.value === type.typeId.toString()
                                        ? ''
                                        : 'hover:bg-background hover:border-input'
                                    }
                                    `}
                                    onClick={() => field.onChange(type.typeId.toString())}
                                >
                                    {type.symbol && (
                                        <span className="text-base text-muted-foreground">
                                            {type.symbol}
                                        </span>
                                    )}
                                    <span>{type.name}</span>
                                </Button>
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage className="text-sm"/>
                </FormItem>
            )}
        />
    )
}

function ReasonField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="reason"
            render={({field}) => (
                <FormItem className="space-y-1">
                    <FormLabel className="text-lg font-medium">Reason</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Please provide a reason for your leave request..."
                            {...field}
                            className="min-h-[120px] resize-none"
                        />
                    </FormControl>
                    <FormMessage className="text-sm"/>
                </FormItem>
            )}
        />
    )
}