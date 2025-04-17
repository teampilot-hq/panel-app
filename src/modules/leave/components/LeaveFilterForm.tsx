import React, {useContext, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {LeaveStatus, UserRole} from "@/core/types/enum.ts";
import {UserResponse} from "@/core/types/user.ts";
import {TeamResponse} from "@/core/types/team.ts";
import {GetLeavesFilter} from "@/core/types/leave.ts";
import {Card} from "@/components/ui/card.tsx";
import {UserContext} from "@/contexts/UserContext.tsx";

type FilterEmployeesFormProps = {
    onFilter: (filters: GetLeavesFilter) => void;
    users: UserResponse[];
    teams: TeamResponse[];
};

export default function LeaveFilterForm({onFilter, teams, users}: FilterEmployeesFormProps) {
    const {user} = useContext(UserContext);
    const isTeamAdmin = user?.role === UserRole.TEAM_ADMIN;
    const assignedTeamId = user?.team?.id;

    const [filters, setFilters] = useState<GetLeavesFilter>({
        teamId: isTeamAdmin ? assignedTeamId : undefined,
        userId: undefined,
        status: LeaveStatus.PENDING
    });

    const handleSearch = () => {
        onFilter(filters);
    };

    const onStatusChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            status: value === "ALL" ? undefined : value as LeaveStatus
        }));
    };

    const onTeamChange = (value: string) => {
        if (isTeamAdmin) return;
        setFilters(prev => ({
            ...prev,
            teamId: value === "ALL" ? undefined : Number(value)
        }));
    };

    const onUserChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            userId: value === "ALL" ? undefined : Number(value)
        }));
    };

    return (
        <Card className="p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-48">
                        <Select value={filters.status} onValueChange={onStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="All"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key="all" value="ALL">All</SelectItem>
                                {Object.values(LeaveStatus).map(status => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full sm:w-48">
                        <Select
                            value={filters.teamId?.toString() || ""}
                            onValueChange={onTeamChange}
                            disabled={isTeamAdmin}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Teams"/>
                            </SelectTrigger>
                            <SelectContent>
                                {user?.role === UserRole.ORGANIZATION_ADMIN ? (
                                    <>
                                        <SelectItem key="all" value="ALL">All Teams</SelectItem>
                                        {teams?.map(team => (
                                            <SelectItem key={team.id} value={team.id.toString()}>
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </>
                                ) : isTeamAdmin && assignedTeamId ? (
                                    <SelectItem key={assignedTeamId} value={assignedTeamId.toString()}>
                                        {teams?.find(team => team.id === assignedTeamId)?.name || "Your Team"}
                                    </SelectItem>
                                ) : null}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full sm:w-48">
                        <Select value={filters.userId?.toString() || ""} onValueChange={onUserChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Users"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key="all" value="ALL">All Users</SelectItem>
                                {users?.map(user => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button className="px-3" onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2"/>
                    Search
                </Button>
            </div>
        </Card>
    );
}