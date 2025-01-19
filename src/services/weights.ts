import { WeightWithBMIModel } from "../types/WeightWithBMI";
import { supabase } from "../supabaseClient";
import { Weight } from "../types/weight";

export async function getWeights(): Promise<WeightWithBMIModel[]> {
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  const { data } = await supabase
    .from("weights_with_bmi")
    .select()
    .eq('user_id', session.user.id)
    .order('created_on', { ascending: false }) as { data: Weight[] | null };
  
  return data || [];
}

export async function addWeight(weight: Weight): Promise<Weight | null> {
  const { data: session } = await supabase.auth.getSession();
  const weightWithUser = { ...weight, user_id: session?.session?.user.id };
  
  const { data } = await supabase
    .from("weights")
    .insert(weightWithUser)
    .select()
    .single() as { data: Weight | null };
  
  return data;
}