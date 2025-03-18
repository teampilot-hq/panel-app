import {Card} from "@/components/ui/card.tsx";
import React from "react";
import {LeavePolicyResponse} from "@/core/types/leave.ts";
import {UserResponse} from "@/core/types/user.ts";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import {UserStatusBadge} from "@/modules/user/components/UserStatusBadge.tsx";
import {UserRoleBadge} from "@/modules/user/components/UserRoleBadge.tsx";
import {CalendarIcon, GlobeIcon, MailIcon, PhoneIcon, TreePalm, UsersIcon} from "lucide-react";
import dayjs from "dayjs";

type EmployeeDetailsCardProps = {
    employeeDetails: UserResponse | null;
    leavePolicy: LeavePolicyResponse | null;
}

export default function UserDetailsCard({employeeDetails, leavePolicy}: EmployeeDetailsCardProps) {
    return (
        <section>
            {employeeDetails ? (
                <Card className="p-4 space-y-6">
                    <div className="flex items-center gap-6">
                        <UserAvatar user={employeeDetails} size={64}/>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold">
                                    {employeeDetails.firstName} {employeeDetails.lastName || ''}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <UserRoleBadge role={employeeDetails.role}/>
                                <UserStatusBadge status={employeeDetails.status}/>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2">
                                <MailIcon className="w-4 h-4 text-muted-foreground"/>
                                <p>{employeeDetails.email}</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-muted-foreground"/>
                                <p>{employeeDetails.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <div className="flex items-center gap-2">
                                <GlobeIcon className="w-4 h-4 text-muted-foreground"/>
                                <p>{employeeDetails.country || 'N/A'} ({employeeDetails.timezone || 'UTC'})</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground">Team</p>
                            <div className="flex items-center gap-2">
                                <UsersIcon className="w-4 h-4 text-muted-foreground"/>
                                <p>{employeeDetails.team.name}</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground">Leave Policy</p>
                            <div className="flex items-center gap-2">
                                <TreePalm className="w-4 h-4 text-muted-foreground"/>
                                <p>{leavePolicy?.name}</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-muted-foreground"/>
                                <p>{dayjs(employeeDetails?.joinedAt).format('D MMM YYYY')}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="p-6">
                    <div className="animate-pulse space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-5 w-48 bg-muted rounded"></div>
                                <div className="h-4 w-32 bg-muted rounded"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-muted rounded"></div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}
        </section>
    )
}