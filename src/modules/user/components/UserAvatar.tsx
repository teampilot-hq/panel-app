import React, {useContext} from "react";
import {UserResponse} from "@/core/types/user.ts";
import {UserContext} from "@/contexts/UserContext.tsx";
import UserDefaultAvatar from "@/modules/user/components/UserDefaultAvatar.tsx";

type AvatarProps = {
    size: number;
    className?: string;
    user: UserResponse;
};

export default function UserAvatar({size, className, user}: AvatarProps) {
    const {accessToken} = useContext(UserContext);

    const commonStyles = {
        height: `${size}px`,
        width: `${size}px`,
        objectFit: 'cover' as const,
        transition: 'all 0.2s ease-in-out'
    };
    if(!user) {
        return (
            <div
                className={`relative inline-flex items-center justify-center rounded-full ${className ?? ''}`}
                style={commonStyles}
            >
                <UserDefaultAvatar name={"O"} size={size}/>
            </div>
        );
    }

    if (!user.avatar) {
        return (
            <div
                className={`relative inline-flex items-center justify-center rounded-full ${className ?? ''}`}
                style={commonStyles}
            >
                <UserDefaultAvatar name={user.firstName + " " + user.lastName} size={size}/>
            </div>
        );
    }

    return (
        <div className="relative inline-block">
            <img
                src={`${user.avatar.url}?token=${accessToken}`}
                alt="User Avatar"
                className={`rounded-full hover:opacity-90 ${className ?? ''}`}
                style={commonStyles}
                loading="lazy"
            />
        </div>
    );
}