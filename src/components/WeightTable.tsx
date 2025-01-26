import { useState } from 'react';
import { WeightWithBMIModel } from '../types/WeightWithBMI';

interface WeightTableProps {
  weights: WeightWithBMIModel[];
  onWeightSelect?: (date: Date | null) => void;
  onEdit?: (weight: WeightWithBMIModel) => void;
  onDelete?: (id: number) => void;
}

export function WeightTable({ weights, onWeightSelect, onEdit, onDelete }: WeightTableProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const transformedWeights = weights.map(weight => ({
    ...weight,
    created_on: new Date(weight.created_on!)
  }));
  
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
    <div className="flex flex-col gap-2 w-full h-full rounded-box drop-shadow-2xl bg-transparent pt-2">
      {/* Days header */}
      <div className="w-full h-4 bg-transparent drop-shadow">
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day) => (
            <div key={day} className="text-center text-sm col-span-1">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Weights grid */}
      <div className="w-full h-full overflow-y-auto rounded-b-box no-scrollbar snap-y bg-transparent">
        <div className="grid grid-cols-7 gap-0.5 my-2">
          {transformedWeights.length > 0 ? (
            [...transformedWeights]
              .sort((a, b) => a.created_on.getTime() - b.created_on.getTime())
              .map((weight) => (
                <div
                  key={weight.created_on.toISOString()}
                  onClick={() => handleWeightClick(weight.created_on)}
                  className={`
                    bg-base-100 stat place-items-center rounded-md snap-start px-0 hover:bg-base-300 col-span-1
                    ${weight.created_on === selectedDate ? 'bg-neutral' : ''}
                    ${getColStart(weight.created_on)}
                  `}
                >
                  <div className="stat-title lg:text-lg text-xs">
                    {weight.created_on.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: '2-digit' })}
                  </div>
                  <div className="stat-value lg:text-2xl text-base">
                    {weight.weight!.toFixed(1)}
                  </div>
                  <div className={`stat-desc ${(weight.difference ?? 0) > 0 ? 'text-error' : 'text-success'}`}>
                    {(weight.difference ?? 0).toFixed(1)}kg
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1 mt-1">
                    <button 
                      className="btn btn-xs btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.({
                          ...weight,
                          created_on: weight.created_on.toISOString()
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-xs btn-ghost text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(weight.id!);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-7 text-center text-sm text-neutral">
              No weights recorded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
