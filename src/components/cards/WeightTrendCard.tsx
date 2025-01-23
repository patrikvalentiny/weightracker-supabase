import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea, TooltipProps } from "recharts";
import { WeightWithBMIModel } from "../../types/WeightWithBMI";


interface WeightTrendCardProps {
    weights: WeightWithBMIModel[];
}

export const WeightTrendCard = ({ weights }: WeightTrendCardProps) => {
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
        const minBMI = Math.min(...weights.map(w => w.bmi!));
        const maxBMI = Math.max(...weights.map(w => w.bmi!));
        const minWeight = Math.min(...weights.map(w => w.weight!));
        const maxWeight = Math.max(...weights.map(w => w.weight!));
        
        // Add padding to both ranges
        const weightPadding = 0.5;
        const bmiPadding = 0.5;
        const yMinWeight = Math.floor(minWeight - weightPadding);
        const yMaxWeight = Math.ceil(maxWeight + weightPadding);
        const yMinBMI = Math.floor(minBMI - bmiPadding);
        const yMaxBMI = Math.ceil(maxBMI + bmiPadding);

        const chartData = weights.map(w => ({
            date: new Date(w.created_on!).toLocaleDateString(),
            weight: w.weight,
            weekAvg: w.one_week_average,
            bmi: w.bmi?.toFixed(1) ?? 0
        })).reverse();

        const bmiZones = [
            { bmi1: 0, bmi2: 18.5, fill: "#90caf9", opacity: 0.2, label: "Underweight" },
            { bmi1: 18.5, bmi2: 24.9, fill: "#81c784", opacity: 0.2, label: "Normal" },
            { bmi1: 24.9, bmi2: 29.9, fill: "#fff176", opacity: 0.2, label: "Overweight" },
            { bmi1: 29.9, bmi2: 100, fill: "#ef9a9a", opacity: 0.2, label: "Obese" }
        ]
        .filter(zone => zone.bmi1 <= maxBMI && zone.bmi2 >= minBMI)
        .map(zone => ({
            ...zone,
            bmi1: Math.max(zone.bmi1, yMinBMI),
            bmi2: Math.min(zone.bmi2, yMaxBMI)
        }));

        const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
            if (!active || !payload || !payload.length) {
                return null;
            }
            const matchingData = chartData.find(data => data.date === label);
            const customPayload = [
                { name: 'Weight', value: matchingData?.weight?.toFixed(1) ?? 0, color: payload.at(0)?.color ?? '#8884d8' },
                { name: 'Week Average', value: matchingData?.weekAvg?.toFixed(1), color: payload.at(1)?.color ?? '#82ca9d' },
                { name: 'BMI', value: matchingData?.bmi, color: 'oklch(var(--a))' }
            ].filter(item => item.value != null);

            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
                    <p className="font-semibold mb-2">{label}</p>
                    {customPayload.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
                                    <span className="capitalize">{entry.name}:</span>
                                    <span className="font-medium">{entry.value ?? 0}</span>
                                </div>
                            ))}
                </div>
            );
        };

        return (
            <div className="card bg-base-200 p-4 col-span-full">
                <h2 className="card-title mb-4">Weight History</h2>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis 
                                yAxisId="weight"
                                domain={[yMinWeight, yMaxWeight]}
                                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis 
                                yAxisId="bmi"
                                orientation="right"
                                domain={[yMinBMI, yMaxBMI]}
                                label={{ value: 'BMI', angle: 90, position: 'insideRight' }}
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
                            />
                            <Line
                                type="monotone"
                                dataKey="weekAvg"
                                stroke="oklch(var(--s))"
                                dot={false}
                                strokeDasharray="5 5"
                                yAxisId="weight"
                            />
                            <Line
                                type="monotone"
                                dataKey="bmi"
                                stroke="oklch(var(--a))"
                                dot={false}
                                yAxisId="bmi"
                            />
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
