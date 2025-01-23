import { useWeights } from "../contexts/WeightsContext";
import { WeightTable } from "../components/WeightTable";

export default function WeightList() {
  const { weights } = useWeights();
  

  return <WeightTable weights={weights} />;
}
