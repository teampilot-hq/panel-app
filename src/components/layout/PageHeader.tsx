import React, {ReactNode} from "react";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {GlobalSearch} from "@/components/GlobalSearch.tsx";

type PageHeaderProps = {
    title: string;
    children?: ReactNode;
    backButton?: string;
}

export default function PageHeader({title, children, backButton}: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <header
            className="sticky top-0 z-10 border-b bg-white">
            <div className="container mx-auto px-4 h-16 lg:h-[63px]">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-3">
                        {backButton && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(backButton)}
                                className="h-8 w-8 rounded-full hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-600"/>
                                <span className="sr-only">Go back</span>
                            </Button>
                        )}

                        <h1 className="text-lg font-semibold text-gray-900 lg:text-xl">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <GlobalSearch />
                        {children}
                    </div>
                </div>
            </div>
        </header>
    );
}