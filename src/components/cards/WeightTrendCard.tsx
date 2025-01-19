import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from "recharts";
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
        const chartData = weights.map(w => ({
            date: new Date(w.created_on).toLocaleDateString(),
            weight: w.weight,
            bmi: w.bmi,
            weekAvg: w.one_week_average
        })).reverse();

        const bmiZones = [
            { y1: 15, y2: 18.5, fill: "#90caf9", opacity: 0.2, label: "Underweight" },
            { y1: 18.5, y2: 24.9, fill: "#81c784", opacity: 0.2, label: "Normal" },
            { y1: 24.9, y2: 29.9, fill: "#fff176", opacity: 0.2, label: "Overweight" },
            { y1: 29.9, y2: 40, fill: "#ef9a9a", opacity: 0.2, label: "Obese" }
        ];

        return (
            <div className="card bg-base-200 p-4 col-span-full">
                <h2 className="card-title mb-4">Weight History</h2>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="weight" domain={['auto', 'auto']} />
                            <YAxis yAxisId="bmi" orientation="right" domain={[15, 40]} />
                            <Tooltip />
                            {bmiZones.map((zone, index) => (
                                <ReferenceArea
                                    key={index}
                                    yAxisId="bmi"
                                    y1={zone.y1}
                                    y2={zone.y2}
                                    fill={zone.fill}
                                    fillOpacity={zone.opacity}
                                    label={{
                                        value: zone.label,
                                        position: 'insideRight',
                                        fill: '#666',
                                        fontSize: 10
                                    }}
                                />
                            ))}
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#8884d8"
                                dot={false}
                                yAxisId="weight"
                            />
                            <Line
                                type="monotone"
                                dataKey="weekAvg"
                                stroke="#82ca9d"
                                dot={false}
                                strokeDasharray="5 5"
                                yAxisId="weight"
                            />
                            <Line
                                type="monotone"
                                dataKey="bmi"
                                stroke="#ffc658"
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
