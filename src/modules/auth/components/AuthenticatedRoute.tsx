import {ReactNode, useContext} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {UserContext} from "@/contexts/UserContext.tsx";
import {Loading} from "@/components/Loading.tsx";

type AuthenticatedRouteProps = {
    children: ReactNode
}

export default function AuthenticatedRoute({children}: AuthenticatedRouteProps) {
    const location = useLocation();
    const {pathname, search} = location;
    const {isAuthenticated, user} = useContext(UserContext)

    if (!user) {
        return <Loading/>;
    }

    if (!isAuthenticated()) {
        return <Navigate to={`/signin?redirect=${pathname}${search}`}/>
    }

    return <>{children}</>
}