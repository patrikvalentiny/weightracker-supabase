import { DateRange, daysToDateRange, dateRangeToDays } from './dateUtils';

interface StoredFilter {
    days: number;  // 0 means all time
}

const STORAGE_KEY = 'weight-chart-filter';

export const loadSavedDateRange = (): DateRange => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return { start: new Date(0), end: new Date() };
        
        const { days } = JSON.parse(saved) as StoredFilter;
        return daysToDateRange(days);
    } catch (error) {
        console.error('Failed to load saved filter:', error);
        return { start: new Date(0), end: new Date() };
    }
};

export const saveDateRange = (range: DateRange) => {
    try {
        const days = dateRangeToDays(range);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ days }));
    } catch (error) {
        console.error('Failed to save filter:', error);
    }
};
