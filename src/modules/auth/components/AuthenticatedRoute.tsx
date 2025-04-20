import {ReactNode, useContext} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {UserContext} from "@/contexts/UserContext.tsx";

type AuthenticatedRouteProps = {
    children: ReactNode
}

export default function AuthenticatedRoute({children}: AuthenticatedRouteProps) {
    const location = useLocation();
    const {pathname, search} = location;
    const {isAuthenticated, user} = useContext(UserContext)

    if (!isAuthenticated()) {
        return <Navigate to={`/signin?redirect=${pathname}${search}`}/>
    }

    if (!user) {
        return (<div>Loading ...</div>);
    }

    return <>{children}</>
}