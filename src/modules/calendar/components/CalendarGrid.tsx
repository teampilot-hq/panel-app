import dayjs from "dayjs";
import {CalendarDayBox} from "@/modules/calendar/components/CalendarDayBox.tsx";
import {LeaveResponse} from "@/core/types/leave.ts";

interface CalendarGridProps {
    currentMonth: Date;
    leaves: LeaveResponse[];
    holidays?: Date[];
    weekends?: string[];
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function CalendarGrid({currentMonth, leaves, holidays = [], weekends = [], selectedDate, onDateSelect,}: CalendarGridProps) {
    const monthStart = dayjs(currentMonth).startOf("month");
    const monthEnd = dayjs(currentMonth).endOf("month");
    const calendarStart = dayjs(monthStart).startOf("week");
    const calendarEnd = dayjs(monthEnd).endOf("week");

    const days: Date[] = [];
    let day = calendarStart;
    while (day.isBefore(calendarEnd) || day.isSame(calendarEnd, "day")) {
        days.push(day.toDate());
        day = day.add(1, "day");
    }

    return (
        <div className="grid grid-cols-7">
            {/* Render weekday headers */}
            {WEEKDAYS.map((weekday) => (
                <div
                    key={weekday}
                    className="text-center py-3 text-sm font-medium text-muted-foreground border-b first:rounded-tl-lg last:rounded-tr-lg"
                >
                    {weekday.slice(0, 3)}
                </div>
            ))}

            {/* Render calendar days */}
            {days.map((date) => {
                const isHoliday = holidays.some((holiday) => dayjs(holiday).isSame(date, "day"));
                const isWeekend = weekends.includes(dayjs(date).format("dddd"));
                const dayLeaves = leaves?.filter((leave) =>
                    dayjs(date).isBetween(leave.startAt, leave.endAt, "day", "[]")
                );

                return (
                    <CalendarDayBox
                        key={date.toString()}
                        date={date}
                        isHoliday={isHoliday}
                        isWeekend={isWeekend}
                        leaves={dayLeaves}
                        isSelected={dayjs(selectedDate).isSame(date, "day")}
                        onClick={() => onDateSelect?.(date)}
                    />
                );
            })}
        </div>
    );
}