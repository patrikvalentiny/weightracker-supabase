import { supabase } from "../supabaseClient";
import { AuthResponse } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";

const REFRESH_TOKEN_KEY = 'weighttracker_refresh_token';

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (response.data.session?.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.session.refresh_token);
  }
  
  return response;
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.VITE_PRODUCTION_URL}/update-password`
  });
  return { error };
}

export async function updatePassword(password: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  return { error };
}

export async function refreshSession(): Promise<Session | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!refreshToken) {
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return null;
    }

    if (session?.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
    }

    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return null;
  }
}

export const getAuthSession = async (retries = 3, delay = 500): Promise<Session | null> => {
  try {
    for (let i = 0; i < retries; i++) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return session;
      }
      
      // Try to refresh the session if initial attempt fails
      const refreshedSession = await refreshSession();
      if (refreshedSession) {
        return refreshedSession;
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
