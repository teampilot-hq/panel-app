import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import TeamsPage from "@/modules/team/pages/TeamsPage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

export default function TeamRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/teams' element={<AuthenticatedRoute><TeamsPage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}