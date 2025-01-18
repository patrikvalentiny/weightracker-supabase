import { createContext, useContext } from 'react';
import { WeightWithBMIModel } from '../types/WeightWithBMI';

interface WeightsContextType {
    weights: WeightWithBMIModel[];
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
