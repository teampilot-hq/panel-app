import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {UserResponse} from "@/core/types/user.ts";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import UserDeleteDialog from "@/modules/user/components/UserDeleteDialog.tsx";
import UserFilterForm from "@/modules/user/components/UserFilterForm.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PaginationComponent from "@/components/Pagination.tsx";
import {UserList} from "@/modules/user/components/UserList.tsx";
import {Plus} from "lucide-react";
import {useDeleteUser, useUsers} from "@/core/stores/userStore.ts";

export default function UsersPage() {
    const [filteredEmployees, setFilteredEmployees] = useState<UserResponse[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<UserResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const navigate = useNavigate();

    const {data: users} = useUsers(currentPage);
    const deleteUserMutation = useDeleteUser();

    useEffect(() => {
        if (users?.contents) {
            setFilteredEmployees(users.contents);
        }
    }, [users]);

    const handleUsersFilter = (query: string, teamId: string) => {
        const filtered = users?.contents.filter((employee) => {
            const matchesQuery =
                query === "" || employee.email.includes(query) || employee.firstName.includes(query) || employee.lastName?.includes(query);
            const matchesTeam = teamId === "" || employee.team.id.toString() === teamId;
            return matchesQuery && matchesTeam;
        });

        setFilteredEmployees(filtered || []);
    };

    const handleUserDelete = async (id: number) => {
        deleteUserMutation.mutate(String(id), {
            onSuccess: () => {
                toast({ title: "Success", description: "Employee removed successfully!" });
            },
            onError: (error) => {
                toast({title: "Error", description: getErrorMessage(error), variant: "destructive",});
            },
        });

        setSelectedEmployee(null);
    };

    const handleUserUpdateClick = (employee: UserResponse) => {
        setCurrentEmployee(employee);
        navigate(`/users/${employee.id}/update`, {state: {from: `/users/`}});
    }

    const handleUserViewClick = (id: number) => {
        navigate(`/users/${id}/`, {state: {from: "/users"}});
    };

    return (
        <>
            <PageHeader title={`Users (${users?.totalContents ?? 0})`}>
                <Button className="px-2 h-9" onClick={() => navigate("/users/create")}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Create
                </Button>
            </PageHeader>

            <PageContent>
                <UserFilterForm onFilter={handleUsersFilter}/>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {filteredEmployees.length > 0 ? (
                            <UserList
                                employeesList={filteredEmployees}
                                setSelectedEmployee={setSelectedEmployee}
                                onUserUpdate={handleUserUpdateClick}
                                onUserView={handleUserViewClick}
                            />
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4} className="p-2 text-center text-sm">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>

                    {selectedEmployee && (
                        <UserDeleteDialog
                            employee={selectedEmployee}
                            handleDeleteEmployee={handleUserDelete}
                            setSelectedEmployeeId={() => setSelectedEmployee(null)}
                            isProcessing={deleteUserMutation.isPending}
                        />
                    )}

                    {users && users.totalPages > 1 && (
                        <PaginationComponent
                            setPageNumber={setCurrentPage}
                            pageNumber={users.pageNumber + 1}
                            totalPages={users.totalPages}
                        />
                    )}
                </Card>
            </PageContent>
        </>
    );
}