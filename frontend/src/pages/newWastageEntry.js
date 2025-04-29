import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewWastageEntry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item: "",
    department: "",
    wastageReason: "",
    quantity: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Wastage Entry:", formData);
    // After successful submission, redirect to wastage list
    navigate("/wastage");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">New Wastage Entry</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Item Name */}
        <div>
          <label className="block mb-2 font-semibold text-[#4B5563]">Item Name</label>
          <input
            type="text"
            name="item"
            value={formData.item}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block mb-2 font-semibold text-[#4B5563]">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Department</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        {/* Wastage Reason */}
        <div>
          <label className="block mb-2 font-semibold text-[#4B5563]">Wastage Reason</label>
          <input
            type="text"
            name="wastageReason"
            value={formData.wastageReason}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
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
          />
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
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWastageEntry;
