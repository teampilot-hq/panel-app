import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createHolidays, fetchHolidays, getHolidays, getHolidaysOverview} from "@/core/services/holidayService.ts";

export function useHolidaysOverview() {
    return useQuery({
        queryKey: ['holidaysOverview'],
        queryFn: getHolidaysOverview,
    });
}

export function useHolidays(year: number, countryCode: string) {
    return useQuery({
        queryKey: ['holidays', year, countryCode],
        queryFn: () => getHolidays(year, countryCode),
        enabled: !!year && !!countryCode,
    });
}

export function useFetchHolidays(year: number, countryCode: string) {
    return useQuery({
        queryKey: ['fetchHolidays', year, countryCode],
        queryFn: () => fetchHolidays(year, countryCode),
    });
}

export function useCreateHolidays() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createHolidays,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['holidays'] });
        },
    });
}