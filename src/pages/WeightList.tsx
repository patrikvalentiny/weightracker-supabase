import { useWeights } from "../contexts/WeightsContext";
import { WeightTable } from "../components/WeightTable";

export default function WeightList() {
  const { weights } = useWeights();
  
  const transformedWeights = weights.map(w => ({
    ...w,
    date: new Date(w.created_on)
  }));

  return <WeightTable weights={transformedWeights} />;
}
