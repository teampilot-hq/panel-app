import React from "react";
import dayjs from "dayjs";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import CalendarLeaveItem from "@/modules/calendar/components/CalendarLeaveItem.tsx";
import {LeaveResponse} from "@/core/types/leave.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {LeaveStatus} from "@/core/types/enum.ts";

interface DayBoxProps {
    date: Date;
    isHoliday: boolean;
    isWeekend: boolean;
    leaves: LeaveResponse[];
    isSelected: boolean;
    onClick: () => void;
}


export const CalendarDayBox: React.FC<DayBoxProps> = ({date, isHoliday, isWeekend, leaves, isSelected, onClick}) => {
    const isToday = dayjs().isSame(date, "day");
    const filteredLeaves = leaves?.filter(leave => leave.status !== LeaveStatus.REJECTED);

    const displayedLeaves = filteredLeaves?.slice(0, 3);
    const remainingLeavesCount = filteredLeaves?.length - displayedLeaves?.length;


    return (
        <div onClick={onClick} className={`p-2 min-h-[150px] min-w-[100px] border-[0.5px]
          ${isSelected ? "bg-gray-100" : ""} ${isHoliday || isWeekend ? "bg-red-50" : ""}`}>
            <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
              ${isToday ? "bg-primary text-white" : isSelected ? "bg-gray-700 text-white" : ""}`}
            >
              {dayjs(date).format("D")}
            </span>

            {displayedLeaves?.map((leave) => <CalendarLeaveItem leave={leave}/>)}

            {/* More Leaves Indicator */}
            {remainingLeavesCount > 0 && (
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            +{remainingLeavesCount} more...
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-[280px] p-0 bg-white rounded-lg border shadow-lg animate-in fade-in-0 z-50"
                        sideOffset={5}
                    >
                        <div className="px-4 py-3 border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                    {dayjs(date).format("MMMM D")}
                                </h4>
                                <Badge variant="outline" className="font-normal">
                                    {leaves.length} leaves
                                </Badge>
                            </div>
                        </div>

                        <div className="px-2 py-2 max-h-[280px] overflow-y-auto">
                            {filteredLeaves.slice(3).map((leave) => (
                                <CalendarLeaveItem leave={leave}/>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};