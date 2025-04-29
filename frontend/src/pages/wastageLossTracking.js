import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleWastage = [
  {
    id: 1,
    item: "Milk Cartons",
    department: "Kitchen",
    wastageReason: "Expired",
    quantity: 10,
    date: "2025-04-20",
    status: "Recorded",
  },
  {
    id: 2,
    item: "Bedsheets",
    department: "Housekeeping",
    wastageReason: "Torn",
    quantity: 5,
    date: "2025-04-22",
    status: "Recorded",
  },
  {
    id: 3,
    item: "Cleaning Sprays",
    department: "Maintenance",
    wastageReason: "Damaged in Transit",
    quantity: 8,
    date: "2025-04-21",
    status: "Recorded",
  },
];

const WastageLossTracking = () => {
  const navigate = useNavigate();
  const [wastageRecords] = useState(sampleWastage);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Wastage & Loss Tracking
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Total Wastage Events</h2>
          <p className="text-gray-600">{wastageRecords.length} Records</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Departments Affected</h2>
          <p className="text-gray-600">Kitchen, Housekeeping, Maintenance</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Major Reasons</h2>
          <p className="text-gray-600">Expired, Damage, Wear & Tear</p>
        </div>
      </div>

      {/* Wastage Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#283593]">Wastage Records</h2>
          <button
            onClick={() => navigate("/wastage/new")}
            className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
          >
            New Wastage
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="bg-[#283593] text-white">
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-left">Department</th>
                <th className="py-2 px-4 text-left">Reason</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {wastageRecords.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="py-2 px-4">{record.item}</td>
                  <td className="py-2 px-4">{record.department}</td>
                  <td className="py-2 px-4">{record.wastageReason}</td>
                  <td className="py-2 px-4">{record.quantity}</td>
                  <td className="py-2 px-4">{record.date}</td>
                  <td className="py-2 px-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                      {record.status}
                    </span>
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

export default WastageLossTracking;
