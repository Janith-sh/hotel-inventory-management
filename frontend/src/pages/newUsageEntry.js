import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewUsageEntry = () => {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    inventoryId: "",
    usedQuantity: "",
    date: new Date().toISOString().split('T')[0],
    reason: "General usage"
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

      const usageData = {
        inventoryId: formData.inventoryId,
        department: formData.department,
        usedQuantity: Number(formData.usedQuantity),
        usageDate: formData.date,
        reason: formData.reason || 'General usage'
      };

      const response = await axios.post('/api/usage', usageData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Usage Entry Submitted:", response.data);
            navigate("/usage-tracking"); // After submit, redirect back to usage page
    } catch (error) {
      console.error("Error submitting usage entry:", error);
      setError(error.response?.data?.message || "Failed to submit usage entry. Please try again.");
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
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Add New Usage Entry
      </h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading inventory items...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          {inventoryItems.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-red-600 mb-2">No inventory items with available stock.</p>
              <p className="text-gray-600">Please add stock to your inventory before creating usage entries.</p>
              <button
                onClick={() => navigate("/inventory-management")}
                className="mt-4 bg-[#283593] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Go to Inventory Management
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                  disabled={submitLoading}
                >
                  <option value="">Select Department</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Reception">Reception</option>
                  <option value="Bar">Bar</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Spa">Spa</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Item</label>
                <select
                  name="inventoryId"
                  value={formData.inventoryId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2"
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

              <div>
                <label className="block text-gray-700 mb-2">Used Quantity</label>
                <input
                  type="number"
                  name="usedQuantity"
                  value={formData.usedQuantity}
                  onChange={handleChange}
                  required
                  placeholder="Enter Quantity Used"
                  className="w-full border rounded-lg px-4 py-2"
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

              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                  disabled={submitLoading}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Reason (Optional)</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Enter reason for usage"
                  className="w-full border rounded-lg px-4 py-2"
                  disabled={submitLoading}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/usage-tracking")}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  disabled={submitLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
                  disabled={submitLoading || (selectedItem && (formData.usedQuantity > maxQuantity))}
                >
                  {submitLoading ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default NewUsageEntry;
