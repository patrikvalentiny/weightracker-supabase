import { useState } from "react";
import { useWeights } from "../contexts/WeightsContext";
import { WeightTable } from "../components/WeightTable";
import { WeightWithBMIModel } from "../types/WeightWithBMI";
import { updateWeight, deleteWeight } from "../services/weights";
import { EditWeightModal } from "../components/EditWeightModal";
import {DeleteWeightModal} from "../components/DeleteWeightModal";

export default function WeightList() {
  const { weights, refreshWeights } = useWeights();
  const [editingWeight, setEditingWeight] = useState<WeightWithBMIModel | null>(null);
  const [deletingWeight, setDeletingWeight] = useState<WeightWithBMIModel | null>(null);

  const handleEdit = (weight: WeightWithBMIModel) => {
    setEditingWeight(weight);
  };

  const handleDelete = (weight: WeightWithBMIModel) => {
    setDeletingWeight(weight);
  };

  const handleUpdateConfirm = async (newWeight: number) => {
    if (!editingWeight?.id) return;
    
    const success = await updateWeight(editingWeight.id, newWeight);
    if (success) {
      setEditingWeight(null);
      refreshWeights();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWeight?.id) return;
    
    const success = await deleteWeight(deletingWeight.id);
    if (success) {
      setDeletingWeight(null);
      refreshWeights();
    }
  };

  return (
    <>
      <WeightTable 
        weights={weights} 
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(weights.find(w => w.id === id)!)}
      />
      
      <EditWeightModal
        weight={editingWeight}
        onClose={() => setEditingWeight(null)}
        onConfirm={handleUpdateConfirm}
      />
      
      <DeleteWeightModal
        weight={deletingWeight}
        onClose={() => setDeletingWeight(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
