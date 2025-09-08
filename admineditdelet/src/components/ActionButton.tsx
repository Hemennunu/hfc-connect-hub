// src/components/ActionButtons.tsx
import React from "react";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete, isDeleting = false }) => {

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete();
    }
  };

  return (
    <div className="space-x-2">
      <button
        onClick={onEdit}
        type="button"
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        type="button"
        disabled={isDeleting}
        className={`px-3 py-1 rounded text-white transition ${
          isDeleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default ActionButtons;
