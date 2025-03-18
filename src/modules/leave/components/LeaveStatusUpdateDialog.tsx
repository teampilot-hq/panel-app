import {useNavigate} from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {LeaveResponse} from '@/core/types/leave.ts';
import {LeaveStatus} from '@/core/types/enum.ts';
import {Button} from '@/components/ui/button';
import {formatDurationRange} from '@/core/utils/date.ts';
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import {Calendar, CalendarRange, Check, Clock, MessageSquare, Users, X} from 'lucide-react';

type LeaveDialogProps = {
    selectedRequest: LeaveResponse | null;
    toggleModal: () => void;
    handleRequest: (status: LeaveStatus, id: number) => void;
    isProcessing: boolean;
};

export default function LeaveStatusUpdateDialog({
                                                    selectedRequest,
                                                    toggleModal,
                                                    handleRequest,
                                                    isProcessing,
                                                }: LeaveDialogProps) {
    const navigate = useNavigate();
    const {id, startAt, endAt, user, activatedType, reason, duration} = selectedRequest;
    const durationText = formatDurationRange(duration, startAt, endAt);

    //Navigate to the balance pages for the specific user.
    const viewBalance = (id: number) => {
        navigate(`/users/${id}/`);
    };

    return (
        <Dialog open={true} onOpenChange={toggleModal}>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-6">
                    <DialogTitle className="flex flex-col items-center gap-6">
                        {/* User Info Section */}
                        <button
                            onClick={() => viewBalance(user.id)}
                            className="group w-full"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <UserAvatar
                                    user={user}
                                    size={64}
                                    className="border-4 border-primary/10 group-hover:border-primary/20 transition-colors"
                                />
                                <div className="text-center">
                                    <div className="text-lg font-medium group-hover:text-primary transition-colors">
                                        {user.firstName} {user.lastName}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </DialogTitle>

                    <DialogDescription>
                        <div className="space-y-6">
                            {/* Leave Details Section */}
                            <div className="space-y-3 px-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-sm text-muted-foreground">Type</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{activatedType.name}</span>
                                        <span className="text-xs text-muted-foreground">{activatedType.symbol}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-sm text-muted-foreground">Duration</span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {duration} {duration === 1 ? "Day" : "Days"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CalendarRange className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-sm text-muted-foreground">Date Range</span>
                                    </div>
                                    <span className="text-sm font-medium">{durationText}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-sm text-muted-foreground">Team</span>
                                    </div>
                                    <span className="text-sm font-medium">{user.team.name}</span>
                                </div>

                                {reason && (
                                    <div className="pt-2 mt-2 border-t">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground"/>
                                            <span className="text-sm text-muted-foreground">Description</span>
                                        </div>
                                        <div className="text-sm pl-6">{reason}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {/* Action Buttons */}
                <DialogFooter className="flex gap-3 sm:gap-0">
                    <Button
                        onClick={() => handleRequest(LeaveStatus.REJECTED, id)}
                        variant="outline"
                        disabled={isProcessing}
                        className="flex-1 border-destructive/30 hover:border-destructive hover:bg-destructive/10 hover:text-destructive text-destructive"
                    >
                        <X className="w-4 h-4 mr-2"/>
                        {isProcessing ? "Processing..." : "Reject"}
                    </Button>
                    <Button
                        onClick={() => handleRequest(LeaveStatus.ACCEPTED, id)}
                        disabled={isProcessing}
                        className="flex-1 bg-primary hover:bg-primary/90"
                    >
                        <Check className="w-4 h-4 mr-2"/>
                        {isProcessing ? "Processing..." : "Accept"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}