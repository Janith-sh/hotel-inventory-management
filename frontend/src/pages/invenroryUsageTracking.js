import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleUsageData = [
  {
    id: 1,
    department: "Housekeeping",
    item: "Toothpaste",
    usedQuantity: 20,
    date: "2025-04-26",
  },
  {
    id: 2,
    department: "Kitchen",
    item: "Rice Bags",
    usedQuantity: 5,
    date: "2025-04-25",
  },
  {
    id: 3,
    department: "Housekeeping",
    item: "Hand Sanitizers",
    usedQuantity: 10,
    date: "2025-04-25",
  },
];

const InventoryUsageTracking = () => {
  const navigate = useNavigate();
  const [usageData] = useState(sampleUsageData);

  const totalUsed = usageData.reduce((sum, record) => sum + record.usedQuantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Inventory Usage Tracking
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Total Items Used</h2>
          <p className="text-gray-600">{totalUsed} Items</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Departments Involved</h2>
          <p className="text-gray-600">
            {[...new Set(usageData.map((data) => data.department))].length} Departments
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Latest Update</h2>
          <p className="text-gray-600">
            {usageData.length > 0 ? usageData[0].date : "No Data"}
          </p>
        </div>
      </div>

      {/* Usage Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#283593]">Usage Records</h2>
          <button
            onClick={() => navigate("/usage/new")}
            className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
          >
            New Usage Entry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#283593] text-white">
                <th className="py-2 px-4 text-left">Department</th>
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-left">Used Quantity</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {usageData.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="py-2 px-4">{record.department}</td>
                  <td className="py-2 px-4">{record.item}</td>
                  <td className="py-2 px-4">{record.usedQuantity}</td>
                  <td className="py-2 px-4">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryUsageTracking;
