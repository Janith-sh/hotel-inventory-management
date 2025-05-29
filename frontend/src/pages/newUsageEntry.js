import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewUsageEntry = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    item: "",
    usedQuantity: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Usage Entry Submitted:", formData);
    // Here you can send data to backend using API call (axios/fetch)
    navigate("/usage"); // After submit, redirect back to usage page
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Add New Usage Entry
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Department</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Reception">Reception</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Item</label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleChange}
              required
              placeholder="Enter Item Name"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

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
            />
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
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/usage-tracking")}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUsageEntry;
