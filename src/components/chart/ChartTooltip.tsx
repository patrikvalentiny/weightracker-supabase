import { TooltipProps } from 'recharts';
import { ChartDataPoint } from './types';

export const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) return null;

    const matchingData = payload[0]?.payload as ChartDataPoint;
    if (!matchingData) return null;

    const entries = [
        { name: 'Weight', value: matchingData.weight?.toFixed(1) + ' kg', color: 'oklch(var(--p))' },
        { name: 'Avg', value: matchingData.weekAvg?.toFixed(1) + ' kg', color: 'oklch(var(--s))' },
        { name: 'BMI', value: matchingData.bmi + ' kg/m²', color: 'oklch(var(--a))' }
    ].filter(item => item.value != null);

    return (
        <div className="bg-base-100/90 p-2 rounded-lg shadow-lg border border-base-300">
            <p className="font-semibold mb-1">{matchingData.date}</p>
            {entries.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
                    <span className="capitalize">{entry.name}:</span>
                    <span className="font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};
