import { supabase } from "../supabaseClient";
import { AuthResponse } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";


export async function signUp(email: string, password: string): Promise<AuthResponse> {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return { error };
}

export async function updatePassword(password: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  return { error };
}

export const getAuthSession = async (retries = 3, delay = 500): Promise<Session | null> => {
  try {
    for (let i = 0; i < retries; i++) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return session;
      }
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting auth session:', error);
    return null;
  }
};
