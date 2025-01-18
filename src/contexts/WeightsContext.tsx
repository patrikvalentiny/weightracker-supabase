import { createContext, useContext } from 'react';
import { Weight } from '../types/weight';

interface WeightsContextType {
    weights: Weight[];
    refreshWeights: () => Promise<void>;
}

export const WeightsContext = createContext<WeightsContextType | undefined>(undefined);

export function useWeights() {
    const context = useContext(WeightsContext);
    if (!context) {
        throw new Error('useWeights must be used within a WeightsProvider');
    }
    return context;
}
