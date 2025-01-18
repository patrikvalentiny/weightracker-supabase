import { WeightInput } from "../components/WeightInput";
import { RecentWeights } from "../components/RecentWeights";
import { addWeight } from "../services/weights";
import { useWeights } from "../contexts/WeightsContext";
import { Weight } from "../types/weight";

export default function Home() {
    const { weights, refreshWeights } = useWeights();
    const latestWeight = weights[0] || null;
    const recentWeights = weights.slice(0, 5);

    const handleWeightSubmit = async (weight: Weight) => {
        try {
            const result = await addWeight(weight);
            if (result) {
                console.log('Weight added successfully:', result);
                refreshWeights();
            }
        } catch (error) {
            console.error('Failed to add weight:', error);
        }
    };

    return (<>
    <WeightInput 
            onSubmit={handleWeightSubmit} 
            lastWeight={latestWeight?.weight ?? 0} 
        />        <h1>Welcome to Weight Tracker</h1>
        
        <RecentWeights weights={recentWeights} />
    </>);
}
