import {Routes} from "react-router-dom";
import AuthenticationRoutes from "@/modules/auth/Routes.tsx";
import CalendarRoutes from "@/modules/calendar/Routes.tsx";
import HomeRoutes from "@/modules/home/Routes.tsx";
import LeaveRoutes from "@/modules/leave/Routes.tsx";
import OrganizationRoutes from "@/modules/organization/Routes.tsx";
import SettingsRoutes from "@/modules/settings/Routes.tsx";
import TeamRoutes from "@/modules/team/Routes.tsx";
import UserRoutes from "@/modules/user/Routes.tsx";
import NotificationRoutes from "@/modules/notification/Routes.tsx";

export default function Root() {
    return (
        <Routes>
            {AuthenticationRoutes()}
            {CalendarRoutes()}
            {HomeRoutes()}
            {LeaveRoutes()}
            {OrganizationRoutes()}
            {SettingsRoutes()}
            {TeamRoutes()}
            {UserRoutes()}
            {NotificationRoutes()}
        </Routes>
    )
}