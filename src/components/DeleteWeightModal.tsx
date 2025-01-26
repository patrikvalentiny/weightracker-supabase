import { WeightWithBMIModel } from "../types/WeightWithBMI";

interface DeleteWeightModalProps {
  weight: WeightWithBMIModel | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteWeightModal({ weight, onClose, onConfirm }: DeleteWeightModalProps) {
  if (!weight) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Weight</h3>
        <p className="py-4">
          Are you sure you want to delete the weight entry from {new Date(weight.created_on!).toLocaleDateString()}?
          <br />
          <span className="font-bold">{weight.weight} kg</span>
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
