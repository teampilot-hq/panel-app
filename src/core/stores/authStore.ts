import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signin, signup, sendGeneratedPasswordEmail} from "@/core/services/authService.ts";

export function useSignin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signin,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user'] });
        },
    });
}

export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signup,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user'] });
        },
    });
}

export function useSendGeneratedPasswordEmail() {
    return useMutation({
        mutationFn: sendGeneratedPasswordEmail
    });
}