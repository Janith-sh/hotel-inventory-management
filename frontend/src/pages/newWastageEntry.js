import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewWastageEntry = () => {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    inventoryId: "",
    department: "",
    wastageReason: "",
    quantity: "",
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch inventory items from backend
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/inventory', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Filter only items with stock > 0
        const availableItems = response.data.filter(item => (item.stockLevel > 0 || item.currentStock > 0));
        setInventoryItems(availableItems);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        setError("Failed to load inventory items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const wastageData = {
        inventoryId: formData.inventoryId,
        department: formData.department,
        quantity: Number(formData.quantity),
        wastageDate: formData.date,
        wastageReason: formData.wastageReason
      };

      const response = await axios.post('/api/wastage', wastageData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Wastage Entry Submitted:", response.data);
      navigate("/wastage-loss"); // After submit, redirect back to wastage list
    } catch (error) {
      console.error("Error submitting wastage entry:", error);
      setError(error.response?.data?.message || "Failed to submit wastage entry. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get the selected inventory item details
  const selectedItem = formData.inventoryId ? 
    inventoryItems.find(item => item._id === formData.inventoryId) : null;
  
  const maxQuantity = selectedItem ? (selectedItem.currentStock || selectedItem.stockLevel || 0) : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">New Wastage Entry</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading inventory items...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {inventoryItems.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-red-600 mb-2">No inventory items with available stock.</p>
              <p className="text-gray-600">Please add stock to your inventory before creating wastage entries.</p>
              <button
                onClick={() => navigate("/inventory-management")}
                className="mt-4 bg-[#283593] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Go to Inventory Management
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Selection */}
              <div>
                <label className="block mb-2 font-semibold text-[#4B5563]">Item</label>
                <select
                  name="inventoryId"
                  value={formData.inventoryId}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                  disabled={submitLoading}
                >
                  <option value="">Select Item</option>
                  {inventoryItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} - Available: {item.currentStock || item.stockLevel || 0}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedItem && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-medium">Item Details:</p>
                  <p className="text-sm text-blue-700">Category: {selectedItem.category}</p>
                  <p className="text-sm text-blue-700">Current Stock: {maxQuantity}</p>
                </div>
              )}

              {/* Department */}
              <div>
                <label className="block mb-2 font-semibold text-[#4B5563]">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                  disabled={submitLoading}
                >
                  <option value="">Select Department</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Reception">Reception</option>
                  <option value="Bar">Bar</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Spa">Spa</option>
                </select>
              </div>

              {/* Wastage Reason */}
              <div>
                <label className="block mb-2 font-semibold text-[#4B5563]">Wastage Reason</label>
                <select
                  name="wastageReason"
                  value={formData.wastageReason}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                  disabled={submitLoading}
                >
                  <option value="">Select Reason</option>
                  <option value="Expired">Expired</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Broken">Broken</option>
                  <option value="Torn">Torn</option>
                  <option value="Spillage">Spillage</option>
                  <option value="Defective">Defective</option>
                  <option value="Quality Issue">Quality Issue</option>
                  <option value="Contamination">Contamination</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block mb-2 font-semibold text-[#4B5563]">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                  min="1"
                  max={maxQuantity}
                  disabled={submitLoading || !selectedItem}
                />
                {selectedItem && (
                  <p className="text-sm text-gray-600 mt-1">
                    Maximum available: {maxQuantity}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block mb-2 font-semibold text-[#4B5563]">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                  disabled={submitLoading}
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/wastage-loss")}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
                  disabled={submitLoading || (selectedItem && (formData.quantity > maxQuantity))}
                >
                  {submitLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default NewWastageEntry;
