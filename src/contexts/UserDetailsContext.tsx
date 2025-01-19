import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserDetails } from '../types/userDetails';
import { getUserDetails, updateUserDetails } from '../services/userDetails';

interface UserDetailsContextType {
    details: UserDetails | null;
    loading: boolean;
    error: string | null;
    updateDetails: (newDetails: Partial<UserDetails>) => Promise<void>;
    refreshDetails: () => Promise<void>;
}

const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined);

export function UserDetailsProvider({ children }: { children: ReactNode }) {
    const [details, setDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshDetails = async () => {
        try {
            setLoading(true);
            const data = await getUserDetails();
            setDetails(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    const updateDetails = async (newDetails: Partial<UserDetails>) => {
        try {
            const updatedDetails = await updateUserDetails(newDetails);
            if (updatedDetails) {
                setDetails(updatedDetails);
            }
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        refreshDetails();
    }, []);

    return (
        <UserDetailsContext.Provider value={{ details, loading, error, updateDetails, refreshDetails }}>
            {children}
        </UserDetailsContext.Provider>
    );
}

export function useUserDetails() {
    const context = useContext(UserDetailsContext);
    if (!context) {
        throw new Error('useUserDetails must be used within a UserDetailsProvider');
    }
    return context;
}
