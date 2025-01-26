import { useState, useEffect } from "react";
import { WeightWithBMIModel } from "../types/WeightWithBMI";

interface EditWeightModalProps {
  weight: WeightWithBMIModel | null;
  onClose: () => void;
  onConfirm: (weight: number) => void;
}

export function EditWeightModal({ weight, onClose, onConfirm }: EditWeightModalProps) {
  const [weightValue, setWeightValue] = useState(weight?.weight?.toString() || '');

  useEffect(() => {
    if (weight?.weight) {
      setWeightValue(weight.weight.toString());
    }
  }, [weight]);

  if (!weight) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWeight = parseFloat(weightValue);
    if (!isNaN(newWeight)) {
      onConfirm(newWeight);
    }
  };

  const adjustWeight = (delta: number) => {
    const currentWeight = weightValue ? parseFloat(weightValue) : 0;
    setWeightValue((currentWeight + delta).toFixed(1));
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Edit Weight - {new Date(weight.created_on!).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'numeric', 
            year: '2-digit' 
          })}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full">
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
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  className="input input-bordered text-center w-full"
                  required
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
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!weightValue || isNaN(parseFloat(weightValue))}
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
