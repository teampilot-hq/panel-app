import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Check, Ellipsis, X} from "lucide-react";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "@/contexts/UserContext.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {clsx} from "clsx";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";

type AccountDropdownProps = {
    isActive: boolean;
    onClick: (name: string) => void;
};

export default function SidebarAccountDropdown({isActive, onClick}: AccountDropdownProps) {
    const [signOut, setSignOut] = useState<boolean>(false);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const viewProfile = () => {
        navigate("/profile");
    };

    const handleDropdownClick = () => {
        onClick("profile");
    };

    return (
        <div className='p-4' onClick={handleDropdownClick}>
            <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                    <div
                        className={clsx("flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors", isActive ? "bg-indigo-100 bg-opacity-75 rounded-lg p-2" : '')}>
                        <div className="h-8 w-8 rounded-full  flex items-center justify-center">
                            <UserAvatar user={user} size={40}/>
                        </div>
                        <div className={clsx("flex-1 text-left", isActive ? "text-gray-700" : '')}>
                            <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <Ellipsis className="h-4 w-4 text-gray-400"/>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={viewProfile} className="text-sm">Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => setSignOut(true)} className="text-sm text-red-600">Sign
                        Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {signOut && <SignOut signOut={signOut} setSignOut={setSignOut}/>}
        </div>
    )
}

type SignOutProps = {
    setSignOut: (signOut: boolean) => void;
    signOut: boolean;
};

function SignOut({setSignOut, signOut}: SignOutProps) {
    const navigate = useNavigate();
    const {signout} = useContext(UserContext);

    const closeSignOut = () => setSignOut(false);

    const handleRequest = (accepted: boolean) => {
        if (accepted) {
            signout();
            navigate('/signin');
        }
        closeSignOut();
    };

    return (
        <Dialog open={signOut} onOpenChange={closeSignOut}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sign out</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to sign out?</DialogDescription>
                <DialogFooter>
                    <Button onClick={() => handleRequest(false)} type="button" variant="outline" className="mr-2">
                        <X className="w-4 h-4 mr-2"/>
                        No
                    </Button>
                    <Button variant="destructive" onClick={() => handleRequest(true)}>
                        <Check className="w-4 h-4 mr-2"/>
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}