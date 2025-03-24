import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {LeaveStatus, UserRole} from '@/core/types/enum.ts';
import {GetLeavesFilter, LeaveResponse} from '@/core/types/leave.ts';
import {Eye} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge.tsx";
import {formatDurationRange} from "@/core/utils/date.ts";
import PageContent from "@/components/layout/PageContent.tsx";
import LeaveStatusUpdateDialog from "@/modules/leave/components/LeaveStatusUpdateDialog.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PaginationComponent from "@/components/Pagination.tsx";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import LeaveDuration from "@/modules/leave/components/LeaveDuration.tsx";
import LeaveFilterForm from "@/modules/leave/components/LeaveFilterForm.tsx";
import {UserResponse} from "@/core/types/user.ts";
import {getUsers} from "@/core/services/userService.ts";
import {getTeams} from "@/core/services/teamService.ts";
import {TeamResponse} from "@/core/types/team.ts";
import LeaveStatusBadge from "@/modules/leave/components/LeaveStatusBadge.tsx";
import {UserContext} from "@/contexts/UserContext.tsx";
import { useLeaves, useUpdateLeaveStatus} from "@/core/stores/leavesStore.ts";

export default function LeavesPage() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [users, setUsers] = useState<UserResponse[] | null>(null);
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const {user} = useContext(UserContext);
    const isTeamAdmin = user?.role === UserRole.TEAM_ADMIN;
    const assignedTeamId = user?.team?.id;
    const [filters, setFilters] = useState<GetLeavesFilter>({
        status: LeaveStatus.PENDING,
        teamId: isTeamAdmin ? assignedTeamId : null
    });

    const {data : leaves, isLoading, isError, error, isFetching, refetch} = useLeaves(filters, currentPage);
    const updateLeaveStatusMutation = useUpdateLeaveStatus();

    const fetchUsers = async () => {
        try {
            const response = await getUsers(0, 100);
            setUsers(response.contents);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }

    const fetchTeams = async () => {
        try {
            const response = await getTeams();
            setTeams(response);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handleLeavesFilter = (newFilters: GetLeavesFilter) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters,
            teamId: isTeamAdmin ? assignedTeamId : newFilters.teamId
        }));
        setCurrentPage(0);
    };

    // Fetch pending leave requests
    useEffect(() => {
        fetchUsers();
        fetchTeams();
    }, [currentPage, filters]);

    // View request details
    const handleRowClick = (request: LeaveResponse) => {
        setSelectedLeave(request);
    };

    // Handle leave request approval or rejection
    const handleRequest = (status: LeaveStatus, id: number) => {
        setIsProcessing(true);
        updateLeaveStatusMutation.mutate(
            { payload: {status}, id },
            {
                onSuccess: () => {
                    toast({title: "Success", description: `Request ${status.toLowerCase()} successfully.`, variant: "default"});
                    setIsProcessing(false);
                    setSelectedLeave(null);
                },
                onError: (error) => {
                    const errorMessage = getErrorMessage(error as Error | string);
                    toast({title: "Error", description: errorMessage, variant: "destructive"});
                    setIsProcessing(false);
                }
            }
        );
    };

    return (
        <>
            <PageHeader title='Leaves'/>
            <PageContent>
                <LeaveFilterForm users={users} teams={teams} onFilter={handleLeavesFilter}/>
                <Card className="flex flex-1 flex-col rounded-lg border shadow-sm mt-4 gap-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaves?.contents.length ? (
                                leaves.contents.map((request) => (
                                    <LeaveRow
                                        key={request.id}
                                        leave={request}
                                        handleRowClick={() => handleRowClick(request)}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No pending requests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {leaves && leaves.totalPages > 1 && (
                        <div className='mx-6 bordet-t'>
                            <PaginationComponent
                                pageNumber={leaves.pageNumber + 1}
                                setPageNumber={setCurrentPage}
                                totalPages={leaves.totalPages}
                            />
                        </div>
                    )}
                </Card>

                {selectedLeave && (
                    <LeaveStatusUpdateDialog
                        selectedRequest={selectedLeave}
                        toggleModal={() => setSelectedLeave(null)}
                        handleRequest={handleRequest}
                        isProcessing={isProcessing}
                    />
                )}
            </PageContent>
        </>
    );
}

// Request Row Component
type LeaveRowProps = {
    leave: LeaveResponse;
    handleRowClick: () => void;
};

function LeaveRow({leave, handleRowClick}: LeaveRowProps) {
    const navigate = useNavigate();
    const durationText = formatDurationRange(leave.duration, leave.startAt, leave.endAt);

    const viewEmployeeProfile = (id: number) => {
        navigate(`/users/${id}/`, {state: {from: "/leaves"}});
    };

    return (
        <TableRow>
            <TableCell className="flex items-center gap-2 font-medium">
                <UserAvatar user={leave.user} size={32}/>
                <span
                    className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-800"
                    onClick={() => viewEmployeeProfile(leave.user.id)}
                >
                    {leave.user.firstName} {leave.user.lastName}
                </span>
            </TableCell>
            <TableCell>
                <Badge variant="outline">
                    {leave.user.team.name}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge variant="outline">{leave.activatedType.symbol} {leave.activatedType.name}</Badge>
            </TableCell>
            <TableCell>{durationText}</TableCell>
            <LeaveDuration duration={leave.duration}/>
            <TableCell>
                <LeaveStatusBadge status={leave.status}/>
            </TableCell>
            <TableCell>
                <Button className="px-1" variant="ghost" size="sm" onClick={handleRowClick}>
                    <Eye className="h-4 "/>
                </Button>
            </TableCell>
        </TableRow>
    );
}