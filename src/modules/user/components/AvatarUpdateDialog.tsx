import {AssetResponse, UserUpdateRequest} from "@/core/types/user.ts";
import React, {useState} from "react";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {dataURLtoFile} from "@/core/utils/file.ts";
import AvatarEditor from "react-avatar-editor";
import {useUpdateUser, useUploadAssets} from "@/core/stores/userStore.ts";

type ChangePictureDialogProps = {
    initialImageUrl: string;
    onChange: (profilePicture: AssetResponse) => void;
}

export function AvatarUpdateDialog({initialImageUrl, onChange}: ChangePictureDialogProps) {
    let editor: AvatarEditor | null = null;
    const [isProcessing, setIsProcessing] = useState(false);
    let [zoom, setZoom] = useState(2);
    const setEditorRef = (ed: AvatarEditor | null) => editor = ed;

    const updateUserMutation = useUpdateUser();
    const uploadAssetsMutation = useUploadAssets();

    const handleSlider = (value: number[]) => {
        if (value.length > 0) {
            setZoom(value[0]);
        }
    }

    const handleCancel = () => {
        onChange(null);
    }

    const handleSave = async () => {
        if (!editor) return;

        try {
            setIsProcessing(true);
            // Get the scaled canvas
            const canvasScaled = editor.getImageScaledToCanvas();
            // Convert canvas to base64 and then to a File
            const base64Image = canvasScaled.toDataURL("image/jpeg");
            const file = dataURLtoFile(base64Image, "profile-image.jpg");
            const files: File[] = [file];

            // Upload assets via the mutation
            uploadAssetsMutation.mutate(
                {bucket: "PROFILE_IMAGE", files},
                {
                    onSuccess: (assetResponse) => {
                        const payload: UserUpdateRequest = {avatarAssetId: assetResponse[0].id,};

                        // Update the user avatar via the mutation
                        updateUserMutation.mutate(
                            payload,
                            {
                                onSuccess: (updatedUser) => {
                                    onChange(updatedUser.avatar);
                                    toast({title: "Success", description: "Profile picture updated successfully!",});
                                },
                                onError: (error) => {
                                    toast({
                                        title: "Error",
                                        description: getErrorMessage(error),
                                        variant: "destructive",
                                    });
                                },
                                onSettled: () => {
                                    setIsProcessing(false);
                                },
                            }
                        );
                    },
                    onError: (error) => {
                        toast({title: "Upload Failed", description: getErrorMessage(error), variant: "destructive",});
                        setIsProcessing(false);
                    },
                }
            );
        } catch (error) {
            console.error("Error:", error);
            setIsProcessing(false);
            toast({title: "Error", description: getErrorMessage(error as Error), variant: "destructive",});
        }
    };

    return (
        <Dialog open={initialImageUrl != null} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogTitle>Edit Picture</DialogTitle>
                <AvatarEditor
                    ref={setEditorRef}
                    image={initialImageUrl}
                    width={200}
                    height={200}
                    border={20}
                    color={[255, 255, 255, 0.6]}
                    className="mx-auto"
                    rotate={0}
                    scale={zoom}
                />
                <Slider
                    onValueChange={handleSlider}
                    defaultValue={[zoom]}
                    min={1}
                    max={10}
                    step={0.1}
                    className="w-full mx-auto my-4"
                />

                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleCancel} className="w-1/2">{isProcessing ? "Waiting ..." : "Cancel"}</Button>
                    <Button variant="default" onClick={handleSave} className="w-1/2 ml-4">{isProcessing ? "Waiting ..." : "Save"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}