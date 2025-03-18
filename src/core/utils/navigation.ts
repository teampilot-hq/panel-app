import {UserRole} from "@/core/types/enum.ts";
import {NavigationItem, navigationItems} from "@/core/types/navigationItem.ts";

export const getAccessibleNavigationItems = (role: UserRole): NavigationItem[] => {
    return navigationItems.filter(item => item.accessLevel.includes(role))
}