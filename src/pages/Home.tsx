import { WeightInput } from "../components/WeightInput";
import { useWeights } from "../contexts/WeightsContext";
import { addWeight } from "../services/weights";
import { Weight } from "../types/weight";
import { CurrentWeightCard } from "../components/cards/CurrentWeightCard";
import { WeeklyProgressCard } from "../components/cards/WeeklyProgressCard";
import { WeightTrendCard } from "../components/cards/WeightTrendCard";
import { StatsCard } from "../components/cards/StatsCard";
import { useUserDetails } from "../hooks/useUserDetails";

export default function Home() {
    const { weights, refreshWeights } = useWeights();
    const { userDetails } = useUserDetails();
    const latestWeight = weights[0];

    const calculateWeightRange = (bmi1: number, bmi2: number, height: number) => {
        const heightInMeters = height / 100;
        const weight1 = +(bmi1 * heightInMeters * heightInMeters).toFixed(1);
        const weight2 = +(bmi2 * heightInMeters * heightInMeters).toFixed(1);
        return `${weight1} - ${weight2}`;
    };

    // Add null checks for BMI calculations
    const currentBMI = latestWeight?.bmi ?? 0;
    const bmiCategory = latestWeight?.bmi_category ?? 'Unknown';

    const lastWeekWeight = weights.find(w => {
        const date = new Date(w.created_on!);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date <= weekAgo;
    });

    const weeklyProgress = lastWeekWeight
        ? Number((latestWeight.one_week_average! - lastWeekWeight.one_week_average!).toFixed(1))
        : 0;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const handleWeightSubmit = async (weight: Weight) => {
        try {
            const result = await addWeight(weight);
            if (result) {
                refreshWeights();
            }
        } catch (error) {
            console.error('Failed to add weight:', error);
        }
    };

    // Calculate goal progress - if current weight is higher than target, show progress towards target
    const firstWeight = weights.at(-1)?.weight;
    const goalProgress = 
        userDetails?.target_weight && latestWeight?.weight && weights.length > 0
            ? Math.min(100, Math.max(0, Math.round(
                ((firstWeight! - latestWeight.weight) / 
                (firstWeight! - userDetails.target_weight)) * 100
            )))
            : 0;

    const BMIInfo = (
        <div className="dropdown dropdown-hover dropdown-top">
            <label tabIndex={0} className="cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
            </label>
            <div tabIndex={0} className="dropdown-content z-[1] p-2 shadow-xl bg-base-100 rounded-box border border-base-300">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>BMI Range</th>
                            <th>Category</th>
                            {userDetails?.height_cm && <th>Weight Range (kg)</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&lt; 16.0</td>
                            <td>Severe Underweight</td>
                            {userDetails?.height_cm && <td>&lt; {(16 * (userDetails.height_cm/100) * (userDetails.height_cm/100)).toFixed(1)}</td>}
                        </tr>
                        <tr>
                            <td>16.0 - 16.9</td>
                            <td>Moderate Underweight</td>
                            {userDetails?.height_cm && <td>{calculateWeightRange(16, 16.99, userDetails.height_cm)}</td>}
                        </tr>
                        <tr>
                            <td>17.0 - 18.4</td>
                            <td>Mild Underweight</td>
                            {userDetails?.height_cm && <td>{calculateWeightRange(17, 18.49, userDetails.height_cm)}</td>}
                        </tr>
                        <tr>
                            <td>18.5 - 24.9</td>
                            <td>Normal Weight</td>
                            {userDetails?.height_cm && <td>{calculateWeightRange(18.5, 24.99, userDetails.height_cm)}</td>}
                        </tr>
                        <tr>
                            <td>25.0 - 29.9</td>
                            <td>Overweight</td>
                            {userDetails?.height_cm && <td>{calculateWeightRange(25, 29.99, userDetails.height_cm)}</td>}
                        </tr>
                        <tr>
                            <td>30.0 - 34.9</td>
                            <td>Class I Obesity</td>
                            {userDetails?.height_cm && <td>{calculateWeightRange(30, 34.99, userDetails.height_cm)}</td>}
                        </tr>
                        <tr>
                            <td>35.0 - 39.9</td>
                            <td>Class II Obesity</td>
                            {userDetails?.height_cm && <td>{calculateWeightRange(35, 39.99, userDetails.height_cm)}</td>}
                        </tr>
                        <tr>
                            <td>≥ 40.0</td>
                            <td>Class III Obesity</td>
                            {userDetails?.height_cm && <td>≥ {(40 * (userDetails.height_cm/100) * (userDetails.height_cm/100)).toFixed(1)}</td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CurrentWeightCard
                    weight={latestWeight?.weight ?? 0}
                    date={latestWeight ? formatDate(latestWeight.created_on!) : 'No data'}
                    difference={latestWeight?.difference ?? 0}
                />
                <WeeklyProgressCard
                    progress={weeklyProgress}
                    hasLastWeekValue={!!lastWeekWeight}
                />
                <WeightTrendCard weights={weights} />

                <StatsCard
                    title="BMI"
                    value={currentBMI}
                    subtitle={bmiCategory}
                >
                    {BMIInfo}
                </StatsCard>

                <StatsCard
                    title="Goal Progress"
                    value={`${goalProgress}%`}
                    progress={goalProgress}
                />

                <StatsCard
                    title="Total Entries"
                    value={weights.length}
                    subtitle="All time"
                />
            </div>

            <div className="fixed bottom-4 right-4">
                <WeightInput
                    onSubmit={handleWeightSubmit}
                    lastWeight={latestWeight?.weight ?? 0}
                />
            </div>
        </div>
    );
}
