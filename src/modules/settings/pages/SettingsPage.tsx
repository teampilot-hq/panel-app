import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Bell, BookOpen, Globe, Lock} from 'lucide-react';
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";

export default function SettingsPage() {
    const navigate = useNavigate();
    const navigateTo = (path: string) => () => navigate(path);

    const settingsItems = [
        {
            title: 'Change Password',
            icon: Lock,
            path: '/settings/change-password',
            color: 'text-red-600'
        },
        {
            title: 'Official Holidays',
            icon: Globe,
            path: '/settings/official-holidays',
            color: 'text-blue-600'
        },
        {
            title: 'Notification',
            icon: Bell,
            path: '/notifications',
            color: 'text-primary'
        },
        {
            title: 'Guide',
            icon: BookOpen,
            path: 'https://github.com/teampilot-hq',
            color: 'text-teal-600',
            external: true
        }
    ];

    return (
        <>
            <PageHeader title='Settings'></PageHeader>
            <PageContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {settingsItems.map((item) => (
                        item.external ? (
                            <a
                                key={item.path}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 
                                         hover:shadow-md transition-all duration-200 
                                         flex items-center gap-4 text-left w-full"
                            >
                                <div className={`${item.color} bg-opacity-10 rounded-lg`}>
                                    <item.icon className="w-5 h-5"/>
                                </div>
                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                            </a>
                        ) : (
                            <button
                                key={item.path}
                                onClick={navigateTo(item.path)}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 
                                         hover:shadow-md transition-all duration-200 
                                         flex items-center gap-4 text-left w-full"
                            >
                                <div className={`${item.color} bg-opacity-10 rounded-lg`}>
                                    <item.icon className="w-5 h-5"/>
                                </div>
                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                            </button>
                        )
                    ))}
                </div>
            </PageContent>
        </>
    );
}