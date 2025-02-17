export interface DateRange {
    start: Date;
    end: Date;
}

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

export const daysToDateRange = (days: number): DateRange => {
    const end = new Date();
    const start = days === 0 
        ? new Date(0) 
        : new Date(end.getTime() - (days * 24 * 60 * 60 * 1000));
    return { start, end };
};

export const dateRangeToDays = (range: DateRange): number => {
    if (range.start.getTime() === new Date(0).getTime()) return 0;
    const diffTime = range.end.getTime() - range.start.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const getMidnightTimeout = () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return tomorrow.getTime() - now.getTime();
};
