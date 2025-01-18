import { Weight } from "../types/weight";

interface RecentWeightsProps {
    weights: Weight[];
}

export function RecentWeights({ weights }: RecentWeightsProps) {
    return (
        <div className="recent-weights">
            <h2>Recent Weights</h2>
            <ul>
                {weights.map(weight => (
                    <li key={weight.id}>
                        {weight.weight}kg - {new Date(weight.created_on).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
