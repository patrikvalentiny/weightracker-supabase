import { useState } from 'react';
import { DateRange, daysToDateRange } from '../../utils/dateUtils';

interface DateRangeFilterProps {
    onSelect: (range: DateRange) => void;
    onClose: () => void;
}

const PRESET_RANGES = [
    { label: "7 Days", days: 7 },
    { label: "1 Month", days: 30 },
    { label: "3 Months", days: 90 },
    { label: "1 Year", days: 365 },
    { label: "All", days: 0 }
] as const;

export const DateRangeFilter = ({ onSelect, onClose }: DateRangeFilterProps) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handlePresetSelect = (days: number) => {
        onSelect(daysToDateRange(days));
        onClose();
    };

    const handleCustomRange = () => {
        if (startDate && endDate) {
            onSelect({ start: new Date(startDate), end: new Date(endDate) });
            onClose();
        }
    };

    return (
        <dialog id="date_filter_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Filter Date Range</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRESET_RANGES.map(range => (
                            <button
                                key={range.label}
                                className="btn btn-outline text-sm h-auto py-2"
                                onClick={() => handlePresetSelect(range.days)}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                    <div className="divider">Or select custom range</div>
                    <div className="space-y-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Start Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered w-full"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate || undefined}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">End Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered w-full"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || undefined}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <button
                            className="btn btn-primary w-full mt-4"
                            onClick={handleCustomRange}
                            disabled={!startDate || !endDate}
                        >
                            Apply Custom Range
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-action">
                    <button className="btn">Close</button>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};
