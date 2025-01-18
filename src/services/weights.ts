import { WeightWithBMIModel } from "../types/WeightWithBMI";
import { supabase } from "../supabaseClient";
import { Weight } from "../types/weight";

export async function getWeights(): Promise<WeightWithBMIModel[]> {
  const { data } = await supabase
    .from("weights_with_bmi")
    .select()
    .order('created_on', { ascending: false }) as { data: Weight[] | null };
  
  return data || [];
}

export async function addWeight(weight: Weight): Promise<Weight | null> {
  const { data } = await supabase
    .from("weights")
    .insert(weight)
    .select()
    .single() as { data: Weight | null };
  
  return data;
}