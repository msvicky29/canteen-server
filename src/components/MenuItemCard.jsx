import React from 'react';
import { Trash2 } from 'lucide-react';

export function MenuItemCard({ id, name, price, category, status, onDelete, onToggleStatus }) {
  const handleDelete = () => {
    console.log('Deleting item with id:', id); // Debug log
    onDelete(id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-800">{name}</h3>
        <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
          {category}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => onToggleStatus(id, e.target.value)}
          className="w-full px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        >
          <option value="available">Available</option>
          <option value="unavailable">Not Available</option>
        </select>
      </div>
      
      <div className="flex justify-between items-center mt-auto">
        <p className="text-xl font-semibold text-orange-500">
          ₹{price}
        </p>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
