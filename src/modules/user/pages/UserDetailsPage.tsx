import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {UserResponse} from "@/core/types/user.ts";
import {getUser} from "@/core/services/userService.ts";
import LeaveList from "@/modules/leave/components/LeaveList.tsx";
import UserLeaveBalanceItem from "@/modules/home/components/UserLeaveBalanceItem.tsx";
import UserDetailsCard from "@/modules/user/components/UserDetailsCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent.tsx";
import {PageSection} from "@/components/layout/PageSection.tsx";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useLeaves} from "@/core/stores/leavesStore.ts";
import {useLeavesPolicy} from "@/core/stores/leavePoliciesStore.ts";
import {useLeaveBalance} from "@/core/stores/leaveTypesStore.ts";

export default function UserDetailsPage() {
    const {id} = useParams();
    const [employeeDetails, setEmployeeDetails] = useState<UserResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const location = useLocation();
    const navigate = useNavigate();

    const {data : leaves, isLoading, isError, error, isFetching, refetch} = useLeaves({userId: Number(id)}, currentPage);
    const {data : leavesPolicy} = useLeavesPolicy(employeeDetails?.leavePolicy?.id);
    const {data: leaveBalance} = useLeaveBalance(Number(id))

    // Unified data fetching
    const fetchEmployeeData = async () => {
        try {
            const userDetails = await getUser(id!);
            setEmployeeDetails(userDetails);
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error | string),
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (id) {
            fetchEmployeeData();
        }
    }, [id, currentPage]);

    const backButtonPath = location.state?.from || "/leaves";

    const handleEmployeeUpdateClick = () => {
        navigate(`/users/${id}/update`, {state: {from: `/users/${id}/`}})
    };

    return (
        <>
            <PageHeader backButton={backButtonPath} title="User Details">
                <Button
                    className="px-4 h-9"
                    onClick={handleEmployeeUpdateClick}
                >
                    <PencilIcon className="w-4 h-4 mr-2"/>
                    Update User
                </Button>
            </PageHeader>
            <PageContent>
                        <UserDetailsCard employeeDetails={employeeDetails} leavePolicy={leavesPolicy}/>

                        <section>
                            <PageSection title="Leave Balance"
                                         description="An overview of user's leave balance, categorized by different leave types, showing the total allocation, used days, and remaining balance for each type."></PageSection>

                            {leaveBalance ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {leaveBalance.map((item) => (
                                        <UserLeaveBalanceItem
                                            key={item?.activatedType.typeId}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Loading leave balance...</p>
                            )}
                        </section>


                        <div className="w-full">
                            {leaves && (
                                <>
                                    <PageSection
                                        title="Leaves"
                                        description="A detailed list of user leave requests"
                                    >
                                    </PageSection>
                                    <Card>
                                        <LeaveList
                                            leaveRequests={leaves}
                                            setCurrentPage={setCurrentPage}
                                        />
                                    </Card>
                                </>
                            )}
                        </div>
            </PageContent>
        </>
    );
}