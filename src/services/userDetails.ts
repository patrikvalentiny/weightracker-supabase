import { supabase } from "../supabaseClient";
import { UserDetails } from "../types/userDetails";
import { getAuthSession } from "./auth";

export async function getUserDetails(): Promise<UserDetails | null> {
  try {
    const session = await getAuthSession();
    if (!session) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_details')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user details:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getUserDetails:', error);
    return null;
  }
}

export async function updateUserDetails(details: Partial<UserDetails>): Promise<UserDetails | null> {
  try {
    const session = await getAuthSession();
    if (!session) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_details')
      .upsert(
        {
          user_id: session.user.id,
          height_cm: details.height_cm!,
          first_name: details.first_name,
          last_name: details.last_name,
          target_weight: details.target_weight,
          updated_at: new Date().toISOString()
        },
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating user details:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in updateUserDetails:', error);
    return null;
  }
}
