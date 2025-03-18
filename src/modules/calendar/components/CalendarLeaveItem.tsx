import {LeaveResponse} from "@/core/types/leave.ts";
import {LeaveStatus} from "@/core/types/enum.ts";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";

const STATUS_STYLES = {
    [LeaveStatus.ACCEPTED]: "bg-green-100 text-green-900 ring-green-200",
    [LeaveStatus.PENDING]: "bg-blue-100 text-blue-900 ring-blue-200",
    [LeaveStatus.REJECTED]: "bg-red-100 text-red-900 ring-red-200",
} as const;

interface CalendarLeaveItemProps {
    leave: LeaveResponse;
}

export default function CalendarLeaveItem({leave}: CalendarLeaveItemProps) {
    const statusClassName = STATUS_STYLES[leave.status] ?? '';

    return (
        <article
            className={`
                flex items-center justify-between
                mt-1.5 px-2 py-1.5 rounded-md
                ring-1 transition-all duration-200
                hover:shadow-sm hover:scale-[1.01]
                ${statusClassName}
            `}
        >
            <div className="flex items-center gap-2">
                <UserAvatar
                    user={leave.user}
                    size={28}

                />
                <span className="text-xs font-medium">
                    {leave.user.firstName}
                </span>
            </div>
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/50">
                {leave.activatedType.symbol ?? "🌴"}
            </span>
        </article>
    );
}