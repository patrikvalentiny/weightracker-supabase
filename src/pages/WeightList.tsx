import { useWeights } from "../contexts/WeightsContext";
import { WeightTable } from "../components/WeightTable";

export default function WeightList() {
  const { weights } = useWeights();
  
  const transformedWeights = weights.map(w => ({
    ...w,
    date: new Date(w.created_on),
    difference: 0 // TODO: Calculate actual difference
  }));

  return <WeightTable weights={transformedWeights} />;
}
