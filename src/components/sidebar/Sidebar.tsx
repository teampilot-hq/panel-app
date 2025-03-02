import React, {useContext, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Building, Calendar, CalendarCheck, Home, Settings, TreePalm, User, Users} from 'lucide-react';
import {UserContext} from "@/contexts/UserContext.tsx";
import SidebarAccountDropdown from "@/components/sidebar/SidebarAccountDropdown.tsx";
import Logo from "@/components/icon/Logo.tsx";
import {NotificationBell} from "@/components/notification/NotificationBell.tsx";

const mainNavigation = [
    {name: 'Home', href: '/', icon: Home},
    {name: 'Calendar', href: '/calendar', icon: Calendar},
    {name: 'Settings', href: '/settings', icon: Settings},
];

const managementNavigation = [
    {name: 'Leaves', href: '/leaves', icon: CalendarCheck},
    {name: 'Organization', href: '/organization', icon: Building},
    {name: 'Leave Policy', href: '/leaves/policies', icon: TreePalm},
    {name: 'Users', href: '/users', icon: User},
    {name: 'Teams', href: '/teams', icon: Users},
];

export default function Sidebar() {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const location = useLocation();
    const {user} = useContext(UserContext);

    const handleNavigation = (path: string) => {
        setSelectedOption(path);
    };

    const isNavigationActive = (href: string) => {
        return location.pathname === href || selectedOption === href;
    };

    const isUserAdmin = user?.role === 'ORGANIZATION_ADMIN';

    return (
        <div className="left-0 hidden md:block md:w-[240px] lg:w-[280px]">
            <div className="bg-white shadow-sm h-full">
                <div className="flex h-full flex-col">
                    <div className="flex justify-between h-16 items-center border-b border-gray-200 px-6">
                        <Link to="/" className="flex items-center gap-3">
                            <Logo/>
                            <span className="text-lg font-semibold text-gray-900">Teamwize</span>
                        </Link>
                        <NotificationBell/>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="space-y-1 px-4">
                            {mainNavigation.map((item) => (
                                <NavigationLink
                                    key={item.name}
                                    {...item}
                                    isActive={isNavigationActive(item.href)}
                                    onClick={handleNavigation}
                                />
                            ))}

                            {isUserAdmin && (
                                <div className="mt-8">
                                    <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider my-3">
                                        Management
                                    </h2>
                                    {managementNavigation.map((item) => (
                                        <NavigationLink
                                            key={item.name}
                                            {...item}
                                            isActive={isNavigationActive(item.href)}
                                            onClick={handleNavigation}
                                        />
                                    ))}
                                </div>
                            )}
                        </nav>
                    </div>


                    <SidebarAccountDropdown
                        isActive={isNavigationActive('/profile')}
                        onClick={handleNavigation}
                    />
                </div>
            </div>
        </div>
    );
}

type NavigationLinkProps = {
    href: string;
    name: string;
    isActive: boolean;
    onClick: (page: string) => void;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function NavigationLink({href, name, icon: Icon, isActive, onClick}: NavigationLinkProps) {
    return (
        <Link
            to={href}
            onClick={() => onClick(href)}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}/>
            {name}
        </Link>
    );
}