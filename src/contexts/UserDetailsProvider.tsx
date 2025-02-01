import { useState, useEffect, ReactNode } from 'react';
import { UserDetails } from '../types/userDetails';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';
import { UserDetailsContext } from './userDetailsContext';

export const UserDetailsProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) {
        setUserDetails(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_details')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails, loading }}>
      {children}
    </UserDetailsContext.Provider>
  );
};
