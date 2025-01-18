import { useRef, FormEvent, useState } from 'react';
import { Weight } from '../types/weight';

interface WeightInputProps {
  onSubmit: (weight: Weight) => void;
  lastWeight?: number;
}

export function WeightInput({ onSubmit, lastWeight }: WeightInputProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [weightValue, setWeightValue] = useState<string>('');
  const [dateValue, setDateValue] = useState<string>(new Date().toISOString().split('T')[0]);

  const isValidWeight = !isNaN(parseFloat(weightValue));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(weightValue);
    if (!isNaN(weight)) {
      onSubmit({ weight, created_on: dateValue } as Weight);
      dialogRef.current?.close();
      setWeightValue('');
      setDateValue(new Date().toISOString().split('T')[0]);
    }
  };

  const adjustWeight = (delta: number) => {
    const currentWeight = weightValue ? parseFloat(weightValue) : 0;
    setWeightValue((currentWeight + delta).toFixed(1));
  };

  const getDiffText = () => {
    if (!lastWeight || !weightValue) return null;
    const diff = parseFloat(weightValue) - lastWeight;
    if (isNaN(diff)) return null;
    
    const sign = diff > 0 ? '+' : '';
    const color = diff < 0 ? 'text-success' : diff > 0 ? 'text-error' : 'text-neutral';
    return <span className={color}>{`${sign}${diff.toFixed(1)}kg`}</span>;
  };

  const handleOpen = () => {
    setWeightValue(lastWeight ? lastWeight.toString() : '');
    dialogRef.current?.showModal();
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="btn btn-primary fixed bottom-4 sm:right-4 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 flex items-center justify-center"
      >
        + Add Weight
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-xs p-4">
          <h3 className="font-bold text-lg mb-4">Add Weight</h3>
          <form onSubmit={handleSubmit} className="form-control">
            <div>
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                value={dateValue}
                max={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                onChange={(e) => setDateValue(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Weight (kg)</span>
              </label>
              <div className="flex justify-center">
                <div className="flex items-center gap-2 w-full">
                  <button 
                    type="button" 
                    className="btn btn-square"
                    onClick={() => adjustWeight(-0.1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    min="0"
                    max="999.9"
                    required
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    className="input input-bordered text-center w-full"
                  />
                  <button 
                    type="button" 
                    className="btn btn-square"
                    onClick={() => adjustWeight(0.1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-center h-6 mt-1">
                {getDiffText()}
              </div>
            </div>
            <div className="modal-action">
              <button type="button" 
                onClick={() => dialogRef.current?.close()}
                className="btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!isValidWeight}
              >
                Save
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
