import {Eye, Globe, Pencil, Trash} from "lucide-react";
import {UserResponse} from "@/core/types/user.ts";
import React from "react";
import {TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import {UserRoleBadge} from "@/modules/user/components/UserRoleBadge.tsx";
import {UserStatusBadge} from "@/modules/user/components/UserStatusBadge.tsx";

type EmployeeTableProps = {
    employeesList: UserResponse[];
    setSelectedEmployee: (employee: UserResponse | null) => void;
    onUserUpdate: (employee: UserResponse) => void;
    onUserView: (id: number) => void;
};

export function UserList({
                             employeesList,
                             setSelectedEmployee,
                             onUserUpdate,
                             onUserView
                         }: EmployeeTableProps) {

    return (
        <TableBody>
            {employeesList.map((employee) => (
                <TableRow
                    key={employee.id}
                >
                    <TableCell className="py-4">
                        <div
                            onClick={() => onUserView(employee.id)}
                            className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                        >
                            <UserAvatar
                                user={employee}
                                size={46}
                                className=""
                            />
                            <div className="flex flex-col">
                                <span
                                    className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-800">
                                    {employee.firstName} {employee.lastName}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {employee.email}
                                </span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm">{employee.country}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">
                            {employee.team.name}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <UserRoleBadge role={employee.role}/>
                    </TableCell>
                    <TableCell>
                        <UserStatusBadge status={employee.status}/>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onUserView(employee.id)}
                                title="View details"
                            >
                                <Eye className="h-4 w-4"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onUserUpdate(employee)}
                                title="Edit employee"
                            >
                                <Pencil className="h-4 w-4"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setSelectedEmployee(employee)}
                                title="Delete employee"
                            >
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}