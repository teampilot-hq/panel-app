import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {CalendarX, CloudDownload, Save, X} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {country} from "@/core/types/country.ts";
import {PageSection} from "@/components/layout/PageSection.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import {useCreateHolidays, useFetchHolidays} from "@/core/stores/holidayStore.ts";

export default function HolidaysImportPage() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedHolidays, setSelectedHolidays] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();

    const { data: holidays = [], isFetching } = useFetchHolidays(selectedYear, selectedCountry);
    const createHolidaysMutation = useCreateHolidays();

    const toggleHolidaySelection = (date: string) => {
        setSelectedHolidays(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    };

    const toggleSelectAll = () => {
        setSelectAll((prev) => !prev);
        setSelectedHolidays(selectAll ? [] : holidays.map((holiday) => holiday.date));
    };

    const saveSelectedHolidays = () => {
        if (selectedHolidays.length === 0) {
            toast({title: "No holidays selected", description: "Please select at least one holiday to import.", variant: "destructive",});
            return;
        }

        const payload = holidays
            .filter(holiday => selectedHolidays.includes(holiday.date))
            .map(holiday => ({
                description: holiday.name,
                date: holiday.date,
                country: selectedCountry,
            }));

        createHolidaysMutation.mutate(payload, {
            onSuccess: () => {
                toast({ title: "Success", description: "Holidays have been imported successfully." });
                navigate("/settings/official-holidays");
            },
            onError: (error) => {
                toast({title: "Failed to import holidays", description: getErrorMessage(error), variant: "destructive",});
            },
        });
    };

    return (
        <div className="min-h-screen">
            <PageHeader backButton='/settings/official-holidays' title='Import Holidays'></PageHeader>

            <PageContent>
                <Card className={"p-5"}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <SelectField
                                label="Year"
                                value={String(selectedYear)}
                                options={[
                                    {label: String(selectedYear - 1), value: String(selectedYear - 1)},
                                    {label: String(selectedYear), value: String(selectedYear)},
                                    {label: String(selectedYear + 1), value: String(selectedYear + 1)},
                                ]}
                                onChange={value => setSelectedYear(Number(value))}
                            />
                            <SelectField
                                label="Country"
                                value={selectedCountry}
                                options={country.map(c => ({label: c.name, value: c.code}))}
                                onChange={setSelectedCountry}
                            />
                        </div>
                        <Button
                            onClick={() => setHasSearched(true)}
                            disabled={isFetching || !selectedCountry}
                            className="w-full sm:w-auto"
                        >
                            <CloudDownload className="w-4 h-4 mr-2"/>
                            {isFetching ? 'Fetching...' : 'Fetch'}
                        </Button>
                    </div>
                </Card>

                {holidays.length > 0 ? (
                    <>
                        <PageSection
                            title="Available Holidays"
                            description={`${selectedHolidays.length} of ${holidays.length} holidays selected`}
                        />
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectAll}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Holiday Name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holidays.map(holiday => (
                                        <TableRow key={holiday.date}>
                                            <TableCell className="w-12">
                                                <Checkbox
                                                    checked={selectedHolidays.includes(holiday.date)}
                                                    onCheckedChange={() => toggleHolidaySelection(holiday.date)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{holiday.date}</TableCell>
                                            <TableCell>{holiday.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/settings/official-holidays')}
                                disabled={isFetching}
                            >
                                <X className="w-4 h-4 mr-2"/>
                                Cancel
                            </Button>
                            <Button
                                onClick={saveSelectedHolidays}
                                disabled={isFetching || selectedHolidays.length === 0}
                            >
                                <Save className="w-4 h-4 mr-2"/>
                                {isFetching ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </>
                ) : hasSearched ? (
                    <Card className="mt-6 p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                            <CalendarX className="h-16 w-16 text-gray-400 mb-4"/>
                            <h3 className="font-semibold text-xl mb-2">No holidays found</h3>
                            <p className="text-gray-500 mb-6">
                                No data available
                                for {selectedCountry ? country.find(c => c.code === selectedCountry)?.name || selectedCountry : "the selected country"} in {selectedYear}.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <Card className="mt-6 p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                            <CloudDownload className="h-16 w-16 text-gray-400 mb-4"/>
                            <h3 className="font-semibold text-xl mb-2">Ready to fetch holidays</h3>
                            <p className="text-gray-500">
                                Select a country and year, then click the Fetch button to load holidays.
                            </p>
                        </div>
                    </Card>
                )}
            </PageContent>
        </div>
    );
}

type SelectFieldProps = {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
};

function SelectField({label, value, options, onChange}: SelectFieldProps) {
    return (
        <div className="w-full sm:w-48">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${label}`}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}