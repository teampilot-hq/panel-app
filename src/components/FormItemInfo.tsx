import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Info} from "lucide-react";
import React from "react";

interface FormItemTooltipProps {
    title: string
}

export default function FormItemInfo({title} : FormItemTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={(e) => e.preventDefault()} className={'ml-2 relative top-0.5'}>
                    <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}