import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "@/index.css";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {calculateWeekends} from "@/core/utils/date.ts";
import {UserContext} from "@/contexts/UserContext.tsx";
import {Week} from "@/core/types/enum.ts";
import {CustomCalendar} from "@/modules/calendar/components/CustomCalendar.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import {capitalizeFirstLetter} from "@/core/utils/string.ts";
import PageHeader from "@/components/layout/PageHeader.tsx";
import {useLeaves} from "@/core/stores/leavesStore.ts";
import {useHolidays} from "@/core/stores/holidayStore.ts";

// 1.Show holidays on calendar
// 2.Show weekends on calendar
// 3.Show leaves on calendar

dayjs.extend(isBetween);

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [weekendsDays, setWeekendsDays] = useState<string[]>([]);
    const navigate = useNavigate();
    const {user, organization} = useContext(UserContext);

    const {data : leaves, isLoading, isError, error, isFetching, refetch} = useLeaves();

    // Fetch holidays from current and next year
    const year = new Date().getFullYear();
    const {data: holidaysCurrentYear = []} = useHolidays(year, user?.country);
    const {data: holidaysNextYear = []} = useHolidays(year + 1, user?.country);

    const allHolidayDates: Date[] = [
        ...holidaysCurrentYear.map(h => new Date(h.date)),
        ...holidaysNextYear.map(h => new Date(h.date))
    ];

    // Fetch holidays and weekends
    useEffect(() => {
        if (organization?.workingDays) {
            const weekends = calculateWeekends(organization.workingDays as Week[]);
            setWeekendsDays(weekends.map(day => capitalizeFirstLetter(day.toLowerCase())));
        }
    }, [organization?.workingDays]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    }

    return (
        <>
            <PageHeader title='Calendar'>
                <Button className='px-2 h-9'
                        onClick={() => navigate("/leaves/create", {state: {from: location.pathname}})}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Request Leave
                </Button>
            </PageHeader>
            <PageContent>
                <CustomCalendar
                    leaves={leaves?.contents}
                    holidays={allHolidayDates}
                    weekends={weekendsDays}
                    onDateSelect={handleDateSelect}
                />
            </PageContent>
        </>
    );
}