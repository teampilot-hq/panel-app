import React, {useContext, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {UserContext} from "@/contexts/UserContext.tsx";
import SidebarAccountDropdown from "@/components/sidebar/SidebarAccountDropdown.tsx";
import Logo from "@/components/icon/Logo.tsx";
import {NotificationBell} from "@/modules/notification/components/NotificationBell.tsx";
import {UserRole} from "@/core/types/enum.ts";
import {NavigationItem, navigationItems} from "@/core/types/NavigationItem.ts";

const getAccessibleNavigationItems = (role: UserRole): NavigationItem[] => {
    return navigationItems.filter(item => item.accessLevel.includes(role))
}

export default function Sidebar() {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const location = useLocation();
    const {user} = useContext(UserContext);
    const accessibleItems = user ? getAccessibleNavigationItems(user.role) : [];

    const handleNavigation = (path: string) => {
        setSelectedOption(path);
    };

    const isNavigationActive = (path: string) => {
        return location.pathname === path || selectedOption === path;
    };

    return (
        <div className="left-0 hidden md:block md:w-[240px] lg:w-[280px]">
            <div className="bg-white shadow-sm h-full">
                <div className="flex h-full flex-col">
                    <div className="flex justify-between h-16 items-center border-b border-gray-200 px-6">
                        <Link to="/" className="flex items-center gap-3">
                            <Logo/>
                            <span className="text-lg font-semibold text-gray-900">Teampilot</span>
                        </Link>
                        <NotificationBell/>
                    </div>

                    <NavigationSection items={accessibleItems} isNavigationActive={isNavigationActive} onClick={handleNavigation}/>

                    <SidebarAccountDropdown isActive={isNavigationActive('/profile')} onClick={handleNavigation}/>
                </div>
            </div>
        </div>
    );
}

type NavigationSectionProps = {
    title?: string;
    items: NavigationItem[];
    isNavigationActive: (path: string) => boolean;
    onClick: (page: string) => void;
}

function NavigationSection({title, items, isNavigationActive, onClick}: NavigationSectionProps) {
    return (
        <div className="flex-1 overflow-y-auto px-4">
            <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider my-3">{title}</h2>
            {items.map((item) => (
                <Link
                    key={item.title}
                    to={item.path}
                    onClick={() => onClick(item.path)}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isNavigationActive(item.path) ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                    <item.icon className={`h-5 w-5 ${isNavigationActive(item.path) ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"}`}/>
                    {item.title}
                </Link>
            ))}
        </div>
    );
}