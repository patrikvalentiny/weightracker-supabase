import { createContext } from 'react';
import { UserDetails } from '../types/userDetails';

interface UserDetailsContextType {
  userDetails: UserDetails | null;
  setUserDetails: (details: UserDetails | null) => void;
  loading: boolean;
}

export const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined);
