import React, { useState, useEffect } from "react";
import axios from "axios";

const CATEGORIES = [
  "Consumables",
  "Perishable Goods",
  "Fixed Assets",
  "Linen & Laundry",
  "Electronics & Appliances",
  "Maintenance Supplies",
];

const DEPARTMENTS = [
  "Maintenance",
  "Kitchen",
  "Housekeeping",
  "Front Office",
  "Laundry",
];

const InventoryManagement = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    department: "",
    threshold: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("/api/inventory");
      setInventoryData(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/inventory", {
        name: newItem.name,
        category: newItem.category,
        department: newItem.department,
        threshold: parseInt(newItem.threshold),
      });

      // Refresh inventory data
      fetchInventory();

      // Reset form
      setNewItem({
        name: "",
        category: "",
        department: "",
        threshold: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditForm(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/inventory/${editItem._id}`, {
        name: editItem.name,
        category: editItem.category,
        department: editItem.department,
        threshold: parseInt(editItem.threshold),
      });
      fetchInventory();
      setShowEditForm(false);
      setEditItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        fetchInventory(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // 🧠 Calculated stats:
  const totalItems = inventoryData.length;
  const lowStockItems = inventoryData.filter(
    (item) => item.stockLevel < item.threshold
  ).length;
  const categories = [...new Set(inventoryData.map((item) => item.category))];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#1a237e]">
        Inventory Management
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Total Items</h2>
          <p className="text-gray-600">{totalItems} Items</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Low Stock Items</h2>
          <p className="text-[#FF6347]">{lowStockItems} Items need restocking</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Categories</h2>
          <p className="text-gray-600">{categories.join(", ")}</p>
        </div>
      </div>

      {/* Add Item Button */}
      <div className="mb-4">
        <button
          className="bg-[#283593] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => setShowForm(true)}
        >
          + Add Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-[#283593]">
              Add New Item
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-gray-700">Item Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700">Category</label>
                <select
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Department</label>
                <select
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newItem.department}
                  onChange={(e) =>
                    setNewItem({ ...newItem, department: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Threshold</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newItem.threshold}
                  onChange={(e) =>
                    setNewItem({ ...newItem, threshold: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#283593] text-white hover:bg-blue-600 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && editItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-[#283593]">
              Edit Item
            </h2>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div>
                <label className="block text-gray-700">Item Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700">Category</label>
                <select
                  required
                  className="w-full p-2 border rounded-lg"
                  value={editItem.category}
                  onChange={(e) =>
                    setEditItem({ ...editItem, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Department</label>
                <select
                  required
                  className="w-full p-2 border rounded-lg"
                  value={editItem.department}
                  onChange={(e) =>
                    setEditItem({ ...editItem, department: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Threshold</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={editItem.threshold}
                  onChange={(e) =>
                    setEditItem({ ...editItem, threshold: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditItem(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#283593] text-white hover:bg-blue-600 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#283593] text-white">
                <th className="py-2 px-4 text-left">Item Name</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Department</th>
                <th className="py-2 px-4 text-left">Stock Level</th>
                <th className="py-2 px-4 text-left">Threshold</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.category}</td>
                  <td className="py-2 px-4">{item.department}</td>
                  <td
                    className={`py-2 px-4 ${
                      item.stockLevel < item.threshold
                        ? "text-red-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {item.stockLevel}
                  </td>
                  <td className="py-2 px-4">{item.threshold}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
