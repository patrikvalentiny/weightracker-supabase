import { supabase } from "../supabaseClient";
import { UserDetails } from "../types/userDetails";

export async function getUserDetails(): Promise<UserDetails | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data } = await supabase
    .from('user_details')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
}

export async function updateUserDetails(details: Partial<UserDetails>): Promise<UserDetails | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_details')
    .upsert(
        {
          user_id: user.id,
          height_cm: details.height_cm!,
          first_name: details.first_name,
          last_name: details.last_name,
          target_weight: details.target_weight,
          updated_at: new Date().toISOString()
        },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
