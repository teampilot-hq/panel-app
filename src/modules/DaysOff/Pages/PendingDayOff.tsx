import {useNavigate} from 'react-router-dom';
import {PageTitle} from '../../../core/components';
import {Clock} from 'lucide-react';
import {Button} from '@/components/ui/button';
import React from "react";
import {Card} from "@/components/ui/card";

export default function PendingDayOff() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <>
            <PageTitle title="Day off Request"/>
            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm justify-center items-center"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <div className="flex flex-col items-center text-center gap-1">
                        <Clock className="h-12 w-12" aria-hidden="true"/>
                        <p className="p-2 text-sm">Your request has been created.</p>
                        <Button className="mt-4" onClick={goHome}>Home</Button>
                    </div>
                </Card>
            </main>
        </>
    )
}