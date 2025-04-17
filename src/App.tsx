import React from "react";
import {UserContextProvider} from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext';
import Root from "@/Routes.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
                <UserContextProvider>
                    <Root />
                </UserContextProvider>
            </ThemeContextProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}