import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getOrganization, updateOrganization} from "@/core/services/organizationService.ts";
import {OrganizationUpdateRequest} from "@/core/types/organization.ts";

export function useOrganization() {
    return useQuery({
        queryKey: ['organization'],
        queryFn: getOrganization
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: OrganizationUpdateRequest) => updateOrganization(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['organization'] });
            queryClient.setQueryData(['organization'], data);
        }
    });
}