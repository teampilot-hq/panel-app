import {Building, Calendar, CalendarCheck, Home, LucideIcon, Settings, TreePalm, User, Users} from "lucide-react";
import {UserRole} from "@/core/types/enum.ts";

export interface NavigationItem {
    title: string;
    path: string;
    icon: LucideIcon;
    description: string;
    accessLevel: UserRole[];
}

export const navigationItems: NavigationItem[] = [
    {
        title: "Home",
        path: "/",
        icon: Home,
        description: "View your leave balance, and leave history.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN, UserRole.TEAM_ADMIN, UserRole.EMPLOYEE]
    },
    {
        title: "Calendar",
        path: "/calendar",
        icon: Calendar,
        description: "View the organization calendar with pending and approved leaves.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN, UserRole.TEAM_ADMIN, UserRole.EMPLOYEE]
    },
    {
        title: "Settings",
        path: "/settings",
        icon: Settings,
        description: "Manage your account settings, holidays, and notification.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN, UserRole.TEAM_ADMIN, UserRole.EMPLOYEE]
    },
    {
        title: "Leaves",
        path: "/leaves",
        icon: CalendarCheck,
        description: "Review and manage leave requests, and access user profiles.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN, UserRole.TEAM_ADMIN]
    },
    {
        title: "Organization",
        path: "/organization",
        icon: Building,
        description: "Configure organization settings like start of the week and working days.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN]
    },
    {
        title: "Leave Policy",
        path: "/leaves/policies",
        icon: TreePalm,
        description: "Create and manage custom leave types and policies for your organization.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN]
    },
    {
        title: "Users",
        path: "/users",
        icon: User,
        description: "Add, edit, or remove users from the organization.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN, UserRole.TEAM_ADMIN]
    },
    {
        title: "Teams",
        path: "/teams",
        icon: Users,
        description: "Add, edit, or remove teams from the organization.",
        accessLevel: [UserRole.ORGANIZATION_ADMIN]
    }
]