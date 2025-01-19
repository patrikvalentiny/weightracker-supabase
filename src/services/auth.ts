import { supabase } from "../supabaseClient";
import { AuthResponse } from "@supabase/supabase-js";

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
