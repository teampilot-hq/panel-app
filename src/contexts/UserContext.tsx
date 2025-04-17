import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { UserResponse } from "@/core/types/user.ts";
import { OrganizationResponse } from "@/core/types/organization.ts";
import { getErrorMessage } from "@/core/utils/errorHandler.ts";
import useLocalStorage from "../hooks/useLocalStorage";
import { toast } from "@/components/ui/use-toast";
import { useOrganization } from "@/core/stores/organizationStore.ts";
import {useUser} from "@/core/stores/userStore.ts";

type UserContextType = {
    user: UserResponse | null;
    setUser: (user: UserResponse | null) => void;
    organization: OrganizationResponse | null;
    accessToken: string | null;
    authenticate: (accessToken: string | null) => void;
    signout: () => void;
    isAuthenticated: () => boolean;
};

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    organization: null,
    accessToken: null,
    authenticate: () => {},
    signout: () => {},
    isAuthenticated: () => false,
});

type UserContextProviderType = {
    children: ReactNode;
};

export const UserContextProvider = ({ children }: UserContextProviderType) => {
    const [accessToken, setAccessToken] = useLocalStorage<string | null>("ACCESS_TOKEN", null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const { data: organization } = useOrganization();
    const { data: fetchedUser, error } = useUser();

    const isAuthenticated = (): boolean => {
        return accessToken != null && accessToken !== "";
    };

    const authenticate = (_accessToken: string | null) => {
        setAccessToken(_accessToken);
    };

    const signout = () => {
        setAccessToken(null);
        setUser(null);
        console.log("userContext signout");
    };

    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
        }
        if (error) {
            const errorMessage = getErrorMessage(error);
            toast({title: "Error", description: errorMessage, variant: "destructive",});
        }
    }, [fetchedUser, error]);

    const contextValue = {
        user: user,
        setUser: setUser,
        organization: organization,
        accessToken: accessToken,
        isAuthenticated: useCallback(() => isAuthenticated(), [accessToken]),
        authenticate: useCallback((accessToken: string | null) => authenticate(accessToken), []),
        signout: useCallback(() => signout(), []),
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};