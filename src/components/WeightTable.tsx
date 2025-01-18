import { useState } from 'react';

interface WeightTableProps {
  weights: Array<{
    date: Date;
    weight: number;
    difference?: number;
  }>;
  onWeightSelect?: (date: Date | null) => void;
}

export function WeightTable({ weights, onWeightSelect }: WeightTableProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  
  // Days array starting with Monday
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const colStartClasses: { [key: number]: string } = {
    0: 'col-start-7', // Sunday
    1: 'col-start-1', // Monday
    2: 'col-start-2', // Tuesday
    3: 'col-start-3', // Wednesday
    4: 'col-start-4', // Thursday
    5: 'col-start-5', // Friday
    6: 'col-start-6'  // Saturday
  };

  const getColStart = (date: Date): string => {
    return colStartClasses[date.getDay()];
  };

  const handleWeightClick = (date: Date) => {
    // If clicking the already selected date, deselect it
    if (selectedDate?.getTime() === date.getTime()) {
      setSelectedDate(null);
      onWeightSelect?.(null);
    } else {
      setSelectedDate(date);
      onWeightSelect?.(date);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Days of week header */}
      <div className="grid grid-cols-7">
        {days.map((day) => (
          <div key={day} className="text-center text-xs opacity-50">
            {day}
          </div>
        ))}
      </div>
      {/* Weights grid */}
      <div className="grid grid-cols-7 gap-1 mt-2">
        {weights.length > 0 ? (
          [...weights]
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((weight) => (
              <div
            key={weight.date.toISOString()}
            onClick={() => handleWeightClick(weight.date)}
            className={`
              card stat compact cursor-pointer hover:bg-base-200
              ${weight.date === selectedDate ? 'bg-base-300' : 'bg-base-100'}
              ${getColStart(weight.date)}
            `}
              >
            <div className="card-body p-2 items-center text-center">
              <div className="text-xs opacity-50">
                {weight.date.toLocaleDateString()}
              </div>
              <div className="stat-value text-lg">
                {weight.weight.toFixed(1)}
              </div>
              <div className={`text-xs ${(weight.difference ?? 0) > 0 ? 'text-error' : 'text-success'}`}>
                {(weight.difference ?? 0).toFixed(1)}kg
              </div>
            </div>
              </div>
            ))
        ) : (
          <div className="col-span-7 text-center opacity-50">
            No weights recorded
          </div>
        )}
      </div>
    </div>
  );
}
