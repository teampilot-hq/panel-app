import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from '@/components/ui/command'
import {Search, TreePalm} from 'lucide-react'
import {Button} from './ui/button'
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import {UserContext} from "@/contexts/UserContext.tsx";
import {getAccessibleNavigationItems} from "@/core/utils/navigation.ts";
import {UserRole} from "@/core/types/enum.ts";
import {useLeavesPolicies} from "@/core/stores/leavePoliciesStore.ts";
import {useUsers} from "@/core/stores/userStore.ts";

export function GlobalSearch() {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const accessibleItems = user ? getAccessibleNavigationItems(user.role) : [];

    const {data : leavesPolicies} = useLeavesPolicies();
    const { data: usersData, isPending } = useUsers(0, 100);
    const users = usersData?.contents;

    const onSelect = (path: string) => {
        setOpen(false)
        navigate(path)
    }

    const filteredUsers = users?.filter(user => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    });

    const filteredPolicies = leavesPolicies?.filter(policy => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return policy.name.toLowerCase().includes(searchLower);
    });

    const visibleUsers = searchTerm ? filteredUsers : filteredUsers?.slice(0, 10);
    const visiblePolicies = searchTerm ? filteredPolicies : filteredPolicies?.slice(0, 10);
    const visiblePages = searchTerm ? accessibleItems : accessibleItems?.slice(0, 5);

    return (
        <>
            <Button variant="outline" className='px-2 h-9' onClick={() => setOpen(true)}>
                <Search className="h-4 w-4 mr-1"/>
                Search
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type to search..." value={searchTerm} onValueChange={setSearchTerm}/>
                <CommandList className="max-h-[80vh] overflow-auto">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {isPending ? (
                        <div className="space-y-1 overflow-hidden px-1 py-2">
                            <div className="animate-pulse space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 w-full rounded bg-muted"/>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <CommandGroup heading="Pages" className="p-2">
                                {visiblePages.map((page) => (
                                    <CommandItem
                                        key={page.path}
                                        onSelect={() => onSelect(page.path)}
                                        className="flex items-center gap-2 p-2 hove:bg-indigo-50 rounded-lg"
                                    >
                                        <page.icon className='h-4 w-4 text-gray-500'/>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{page.title}</span>
                                            <span className="text-gray-500 text-sm">{page.description}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>

                            {(user.role === UserRole.ORGANIZATION_ADMIN || user.role === UserRole.TEAM_ADMIN) && (
                                <>
                                    <CommandGroup heading="Users" className="p-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-auto">
                                            {visibleUsers.map((user) => (
                                                <CommandItem
                                                    key={user.id}
                                                    onSelect={() => onSelect(`/users/${user.id}`)}
                                                    className="p-3 cursor-pointer hover:bg-indigo-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <UserAvatar size={32} user={user}/>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{user.firstName} {user.lastName}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </div>
                                    </CommandGroup>

                                    <CommandGroup heading="Leave Policies" className="p-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-auto">
                                        {visiblePolicies?.map((policy) => (
                                            <CommandItem
                                                key={policy.id}
                                                onSelect={() => onSelect(`/leaves/policies/${policy.id}`)}
                                                className="flex items-center gap-2 p-2 hover:bg-indigo-50 rounded-lg"
                                            >
                                                <TreePalm className='h-4 w-4 text-gray-500' />
                                                <span className="font-medium">{policy.name}</span>
                                            </CommandItem>
                                        ))}
                                        </div>
                                    </CommandGroup>
                                </>
                            )}
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}