import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AddItemForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'meals',
    status: 'available'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert price to number
    const dataToSend = {
      ...formData,
      price: Number(formData.price)
    };

    try {
      const response = await fetch('https://canteen-server-kyek.onrender.com/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const savedItem = await response.json();
        console.log('Item added successfully:', savedItem);
        if (onSuccess) onSuccess(); // Call onSuccess to refresh the list
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to add item:', errorData);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Menu Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="meals">Meals</option>
              <option value="snacks">Snacks</option>
              <option value="beverages">Beverages</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
