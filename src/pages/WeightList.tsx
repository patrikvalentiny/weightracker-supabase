import { useEffect, useState } from "react";
import { Weight } from "../types/weight";
import { getWeights } from "../services/weights";
import { WeightTable } from "../components/WeightTable";

export default function WeightList() {
  const [weights, setWeights] = useState<Weight[]>([]);

  useEffect(() => {
    fetchWeights();
  }, []);

  async function fetchWeights() {
    const data = await getWeights();
    // Transform the data to match WeightTable props
    const transformedData = data.map(w => ({
      date: new Date(w.created_at),
      weight: w.weight,
      // You can calculate difference here if needed
      difference: 0 // TODO: Calculate actual difference
    }));
    setWeights(transformedData);
  }

  return <WeightTable weights={weights} />;
}
