import {useMutation} from "@tanstack/react-query";
import {signin, signup, sendGeneratedPasswordEmail} from "@/core/services/authService.ts";

export function useSignin() {
    return useMutation({
        mutationFn: signin
    });
}

export function useSignup() {
    return useMutation({
        mutationFn: signup
    });
}

export function useSendGeneratedPasswordEmail() {
    return useMutation({
        mutationFn: sendGeneratedPasswordEmail
    });
}