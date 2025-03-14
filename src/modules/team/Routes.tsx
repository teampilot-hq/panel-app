import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import TeamsPage from "@/modules/team/pages/TeamsPage.tsx";
import TeamCreatePage from "@/modules/team/pages/TeamCreatePage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

export default function TeamRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/teams' element={<AuthenticatedRoute><TeamsPage/></AuthenticatedRoute>}></Route>
            <Route path='/team/create' element={<AuthenticatedRoute><TeamCreatePage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}