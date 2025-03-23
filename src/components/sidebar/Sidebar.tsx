import React, {useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {UserContext} from "@/contexts/UserContext.tsx";
import SidebarAccountDropdown from "@/components/sidebar/SidebarAccountDropdown.tsx";
import Logo from "@/components/icon/Logo.tsx";
import {NotificationBell} from "@/modules/notification/components/NotificationBell.tsx";
import {NavigationItem} from "@/core/types/navigationItem.ts";
import {getAccessibleNavigationItems} from "@/core/utils/navigation.ts";

export default function Sidebar() {
    const location = useLocation();
    const {user} = useContext(UserContext);
    const accessibleItems = user ? getAccessibleNavigationItems(user.role) : [];

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

                    <NavigationSection items={accessibleItems} currentPath={location.pathname}/>

                    <SidebarAccountDropdown isActive={location.pathname === '/profile'} />
                </div>
            </div>
        </div>
    );
}

type NavigationSectionProps = {
    title?: string;
    items: NavigationItem[];
    currentPath: string;
};

function NavigationSection({ title, items, currentPath }: NavigationSectionProps) {
    return (
        <div className="flex-1 overflow-y-auto px-4">
            <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider my-3">{title}</h2>
            {items.map((item) => {
                const isActive = currentPath === item.path;

                return (
                    <Link
                        key={item.title}
                        to={item.path}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <item.icon
                            className={`h-5 w-5 ${
                                isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                            }`}
                        />
                        {item.title}
                    </Link>
                );
            })}
        </div>
    );
}