import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import LeaveStatusBadge from "@/modules/leave/components/LeaveStatusBadge.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {LeaveResponse} from "@/core/types/leave.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {formatDurationRange} from "@/core/utils/date.ts";
import LeaveDuration from "@/modules/leave/components/LeaveDuration.tsx";
import {AlertTriangle, Calendar, Users} from "lucide-react";

type LeaveConflictProps = {
    conflicts: LeaveResponse[];
}

export default function LeaveConflicts({conflicts}: LeaveConflictProps) {
    return (
        <Card className="border-red-100 bg-red-50">
            <div className="px-4 py-3 border-b border-red-200">
                <h3 className="flex items-center gap-2 text-red-600 font-semibold">
                    <AlertTriangle className="w-5 h-5"/>
                    <span>
                        {conflicts.length === 1
                            ? '1 Conflicting Leave'
                            : `${conflicts.length} Conflicting Leaves`}
                    </span>
                </h3>
            </div>
            <CardContent className="space-y-2 p-4">
                {conflicts.map((leave) => (
                    <div
                        key={leave.id}
                        className="flex items-center justify-between bg-white border border-red-200 rounded-lg px-4 py-2 shadow-sm gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <UserAvatar
                                user={leave.user}
                                size={40}
                            />
                            <span className="text-sm font-medium">{leave.user.firstName} {leave.user.lastName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                            <Users className="w-4 h-4"/>
                            {leave.user.team.name}
                        </div>
                        <Badge variant="outline" className="px-3 flex text-gray-600 items-center gap-2">
                            {leave.activatedType.symbol}
                            {leave.activatedType.name}
                        </Badge>
                        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                            <Calendar className="w-4 h-4"/>
                            {formatDurationRange(leave.duration, leave.startAt, leave.endAt)}
                        </div>
                        <LeaveDuration
                            duration={leave.duration}
                            className="p-0 justify-center text-gray-600"
                        />
                        <LeaveStatusBadge status={leave.status}/>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}