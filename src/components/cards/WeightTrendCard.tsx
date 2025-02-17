import { useState, useMemo, useEffect } from "react";
import { LineChart, ResponsiveContainer, CartesianGrid, Line, XAxis, YAxis, ReferenceArea, Tooltip } from "recharts";
import { WeightWithBMIModel } from "../../types/WeightWithBMI";
import { useUserDetails } from "../../contexts/hooks/useUserDetails";
import { DateRange, formatDate, getMidnightTimeout, daysToDateRange, dateRangeToDays } from "../../utils/dateUtils";
import { loadSavedDateRange, saveDateRange } from "../../utils/storageUtils";
import { DateRangeFilter } from "../filters/DateRangeFilter";
import { CustomTooltip } from "../chart/ChartTooltip";
import { BMI_ZONES } from "../chart/types";

interface WeightTrendCardProps {
    weights: WeightWithBMIModel[];
}

export const WeightTrendCard = ({ weights }: WeightTrendCardProps) => {
    const [dateRange, setDateRange] = useState<DateRange>(() => loadSavedDateRange());

    useEffect(() => {
        saveDateRange(dateRange);
        const timer = setTimeout(() => {
            const days = dateRangeToDays(dateRange);
            setDateRange(daysToDateRange(days));
        }, getMidnightTimeout());

        return () => clearTimeout(timer);
    }, [dateRange]);

    const isFiltered = dateRange.start.getTime() !== new Date(0).getTime();

    if (!weights || weights.length === 0) {
        return (
            <div className="card bg-base-200 md:col-span-3 p-8">
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">No weight data yet</h3>
                    <p className="text-sm opacity-70">Add your first weight entry to see your progress chart</p>
                </div>
            </div>
        );
    }

    const WeightChart = () => {
        const { userDetails } = useUserDetails();
        const heightInMeters = (userDetails?.height_cm ?? 170) / 100;
        
        const filteredWeights = useMemo(() => {
            return weights.filter(w => {
                const date = new Date(w.created_on!);
                return date >= dateRange.start && date <= dateRange.end;
            });
        }, []);

        const minWeight = Math.min(...filteredWeights.map(w => w.weight!));
        const maxWeight = Math.max(...filteredWeights.map(w => w.weight!));
        
        // Add padding to weight range
        const weightPadding = 0.5;
        const yMinWeight = Math.floor(minWeight - weightPadding);
        const yMaxWeight = Math.ceil(maxWeight + weightPadding);

        // Calculate BMI range from weight range using height
        const yMinBMI = +(yMinWeight / (heightInMeters * heightInMeters)).toFixed(1);
        const yMaxBMI = +(yMaxWeight / (heightInMeters * heightInMeters)).toFixed(1);

        const chartData = filteredWeights.map(w => ({
            date: formatDate(new Date(w.created_on!)),
            dateValue: new Date(w.created_on!).getTime(),
            weight: w.weight,
            weekAvg: w.one_week_average,
            bmi: w.bmi?.toFixed(1) ?? 0
        })).reverse();

        const bmiZones = BMI_ZONES
            .filter(zone => zone.bmi1 <= yMaxBMI && zone.bmi2 >= yMinBMI)
            .map(zone => ({
                ...zone,
                bmi1: Math.max(zone.bmi1, yMinBMI),
                bmi2: Math.min(zone.bmi2, yMaxBMI)
            }));

        return (
            <div className="card bg-base-200 p-4 col-span-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="card-title">Weight History</h2>
                        {isFiltered && (
                            <span className="text-sm opacity-70 text-center h-full">
                                {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {isFiltered && (
                            <button 
                                className="btn btn-sm btn-ghost"
                                onClick={() => setDateRange({ start: new Date(0), end: new Date() })}
                                title="Clear filter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <DateRangeFilter
                            onSelect={setDateRange}
                            onClose={() => {
                                (document.getElementById('date_filter_modal') as HTMLDialogElement)?.close();
                            }}
                        />
                        <button 
                            className={`btn btn-sm ${isFiltered ? 'btn-accent' : ''}`}
                            onClick={() => (document.getElementById('date_filter_modal') as HTMLDialogElement)?.showModal()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                            </svg>
                            <span className="hidden sm:inline ml-2">Filter</span>
                        </button>
                        <DateRangeFilter
                            onSelect={setDateRange}
                            onClose={() => {
                                (document.getElementById('date_filter_modal') as HTMLDialogElement)?.close();
                            }}
                        />
                    </div>
                </div>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="dateValue"
                                type="number"
                                scale="time"
                                domain={['auto','auto']}
                                tickFormatter={(value) => formatDate(new Date(value))}
                            />
                            <YAxis 
                                yAxisId="weight"
                                domain={[yMinWeight, yMaxWeight]}
                                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                                // unit=" kg"
                            />
                            <YAxis 
                                yAxisId="bmi"
                                orientation="right"
                                domain={[yMinBMI, yMaxBMI]}
                                label={{ value: 'BMI (kg/m²)', angle: 90, position: 'insideRight' }}
                                // unit={" kg/m²"}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {bmiZones.map((zone, index) => (
                                <ReferenceArea
                                    key={index}
                                    yAxisId="bmi"
                                    y1={zone.bmi1}
                                    y2={zone.bmi2}
                                    fill={zone.fill}
                                    fillOpacity={zone.opacity}
                                    label={{
                                        value: zone.label,
                                        position: 'insideBottomRight',
                                        fill: 'oklch(var(--bc))',
                                        fontSize: 10
                                    }}
                                />
                            ))}
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="oklch(var(--p))"
                                dot={false}
                                yAxisId="weight"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                unit=" kg"
                            />
                            <Line
                                type="monotone"
                                dataKey="weekAvg"
                                stroke="oklch(var(--s))"
                                dot={false}
                                strokeDasharray="5 5"
                                yAxisId="weight"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                unit=" kg"
                            />
                            {/* <Line
                                type="monotone"
                                dataKey="bmi"
                                stroke="oklch(var(--a))"
                                dot={false}
                                yAxisId="bmi"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            /> */}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <div className="card bg-base-200 md:col-span-3">
            <WeightChart />
        </div>
    );
};
