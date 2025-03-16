import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {Check, X} from "lucide-react";

type DeleteDialogProps = {
    name: string;
    label: string;
    handleAccept: () => void;
    handleReject: () => void;
};

export function NotificationTriggerDeleteDialog({name, label, handleAccept, handleReject}: DeleteDialogProps) {
    return (
        <Dialog open={true} onOpenChange={handleReject}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove {name}</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to remove {label}?</DialogDescription>
                <DialogFooter>
                    <Button onClick={handleReject} type="button" variant="outline" className="mr-2">
                        <X className="w-4 h-4 mr-2"/>
                        No
                    </Button>
                    <Button variant="destructive" onClick={handleAccept}>
                        <Check className="w-4 h-4 mr-2"/>
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}