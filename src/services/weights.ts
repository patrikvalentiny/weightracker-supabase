import { WeightWithBMIModel } from "../types/WeightWithBMI";
import { supabase } from "../supabaseClient";
import { Weight } from "../types/weight";
import { getAuthSession } from "./auth";

export async function getWeights(): Promise<WeightWithBMIModel[]> {
  try {
    const session = await getAuthSession();
    if (!session) {
      return [];
    }

    const { data, error } = await supabase
      .from("weights_with_bmi")
      .select()
      .eq('user_id', session.user.id)
      .order('created_on', { ascending: false });

    if (error) {
      console.error('Error fetching weights:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getWeights:', error);
    return [];
  }
}

export async function addWeight(weight: Weight): Promise<Weight | null> {
  try {
    const session = await getAuthSession();
    if (!session) {
      return null;
    }

    const weightWithUser = { ...weight, user_id: session.user.id };
    const { data, error } = await supabase
      .from("weights")
      .upsert(weightWithUser)
      .select()
      .single();

    if (error) {
      console.error('Error adding weight:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error in addWeight:', error);
    return null;
  }
}