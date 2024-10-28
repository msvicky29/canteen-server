import React, { useState, useEffect } from 'react';
import { PlusCircle, Coffee,LogOut } from 'lucide-react';
import { MenuItemCard } from './MenuItemCard';
import { AddItemForm } from './AddItemForm';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  // Fetch items when component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menu-items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now().toString(), status: 'available' }]);
    setShowAddForm(false);
  };
  const handleLogOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    navigate('/')
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menu-items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove item from local state after successful deletion
        setItems(items.filter(item => item._id !== id));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menu-items/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state only after successful API update
        setItems(items.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        ));
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchItems(); // Refresh the items list after adding
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Coffee className="text-orange-500" size={40} />
            <h1 className="text-4xl font-extrabold text-gray-800">Canteen Menu Admin</h1>
          </div>
          <div  classname='flex gap-4 '>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
            >
            <PlusCircle size={24} />
            <span className="font-semibold">Add Item</span>
          </button>
          <button
            onClick={handleLogOut}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-md ml-4"
            >
            <LogOut size={24} />
            <span className="font-semibold">Log Out</span>
          </button>
            </div>
        </div>

        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 bg-white shadow-sm"
          >
            <option value="all">All Items</option>
            <option value="snacks">Snacks</option>
            <option value="beverages">Beverages</option>
            <option value="meals">Meals</option>
            <option value="desserts">Desserts</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item._id}
              id={item._id}  // Pass MongoDB's _id
              name={item.name}
              price={item.price}
              category={item.category}
              status={item.status}
              onDelete={handleDeleteItem}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl font-medium">No items found in this category</p>
          </div>
        )}

        {showAddForm && (
          <AddItemForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleAddSuccess}  // Pass the success handler
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
