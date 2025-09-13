import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WastageLossTracking = () => {
  const navigate = useNavigate();
  const [wastageRecords, setWastageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWastageData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/wastage', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setWastageRecords(response.data);
      } catch (error) {
        console.error("Error fetching wastage data:", error);
        setError("Failed to load wastage data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWastageData();
  }, [navigate]);

  // Calculate stats from actual data
  const departments = [...new Set(wastageRecords.map(record => record.department))];
  
  // Get top 3 reasons
  const reasonCounts = {};
  wastageRecords.forEach(record => {
    reasonCounts[record.wastageReason] = (reasonCounts[record.wastageReason] || 0) + 1;
  });
  
  const topReasons = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(item => item[0]);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Wastage & Loss Tracking
      </h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading wastage data...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#4B5563]">Total Wastage Events</h2>
              <p className="text-gray-600">{wastageRecords.length} Records</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#4B5563]">Departments Affected</h2>
              <p className="text-gray-600">
                {departments.length > 0 ? departments.join(", ") : "None"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#4B5563]">Major Reasons</h2>
              <p className="text-gray-600">
                {topReasons.length > 0 ? topReasons.join(", ") : "None recorded"}
              </p>
            </div>
          </div>

          {/* Wastage Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#283593]">Wastage Records</h2>
              <button
                onClick={() => navigate("/wastage/new")}
                className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
                disabled={loading}
              >
                New Wastage
              </button>
            </div>

            <div className="overflow-x-auto">
              {wastageRecords.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No wastage records found.</div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr className="bg-[#283593] text-white">
                      <th className="py-2 px-4 text-left">Item</th>
                      <th className="py-2 px-4 text-left">Department</th>
                      <th className="py-2 px-4 text-left">Reason</th>
                      <th className="py-2 px-4 text-left">Quantity</th>
                      <th className="py-2 px-4 text-left">Previous Stock</th>
                      <th className="py-2 px-4 text-left">Current Stock</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wastageRecords.map((record) => (
                      <tr key={record._id} className="border-t">
                        <td className="py-2 px-4">{record.itemName}</td>
                        <td className="py-2 px-4">{record.department}</td>
                        <td className="py-2 px-4">{record.wastageReason}</td>
                        <td className="py-2 px-4">{record.quantity}</td>
                        <td className="py-2 px-4">{record.previousStock}</td>
                        <td className="py-2 px-4">{record.newStock}</td>
                        <td className="py-2 px-4">{new Date(record.wastageDate).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <span className={`text-white px-3 py-1 rounded-full ${
                            record.status === 'Reviewed' ? 'bg-blue-500' :
                            record.status === 'Disputed' ? 'bg-red-500' :
                            'bg-green-500'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WastageLossTracking;
