import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InventoryUsageTracking = () => {
  const navigate = useNavigate();
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/usage', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsageData(response.data);
      } catch (error) {
        console.error("Error fetching usage data:", error);
        setError("Failed to load usage data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [navigate]);

  const totalUsed = usageData.reduce((sum, record) => sum + record.usedQuantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Inventory Usage Tracking
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
          <p className="text-gray-600">Loading usage data...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#4B5563]">Total Items Used</h2>
              <p className="text-gray-600">{totalUsed} Units</p>
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
                {usageData.length > 0 ? new Date(usageData[0].usageDate).toLocaleDateString() : "No Data"}
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
                disabled={loading}
              >
                New Usage Entry
              </button>
            </div>

            <div className="overflow-x-auto">
              {usageData.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No usage records found.</div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#283593] text-white">
                      <th className="py-2 px-4 text-left">Department</th>
                      <th className="py-2 px-4 text-left">Item</th>
                      <th className="py-2 px-4 text-left">Used Quantity</th>
                      <th className="py-2 px-4 text-left">Previous Stock</th>
                      <th className="py-2 px-4 text-left">Current Stock</th>
                      <th className="py-2 px-4 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageData.map((record) => (
                      <tr key={record._id} className="border-t">
                        <td className="py-2 px-4">{record.department}</td>
                        <td className="py-2 px-4">{record.itemName}</td>
                        <td className="py-2 px-4">{record.usedQuantity}</td>
                        <td className="py-2 px-4">{record.previousStock}</td>
                        <td className="py-2 px-4">{record.newStock}</td>
                        <td className="py-2 px-4">{new Date(record.usageDate).toLocaleDateString()}</td>
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

export default InventoryUsageTracking;
