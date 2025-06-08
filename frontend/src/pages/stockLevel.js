import React, { useState, useEffect } from "react";
import axios from "axios";

const StockLevelMonitoring = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [error, setError] = useState(null);

  // Fetch inventory data from the API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get accessToken from localStorage using the correct key
        const token = localStorage.getItem('accessToken');
        const response = await axios.get("/api/inventory", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Inventory data fetched successfully");
        setInventoryData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        setError("Failed to load inventory data");
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const getStatus = (stockLevel, threshold) => {
    if (stockLevel >= threshold) return "OK";
    if (stockLevel < threshold && stockLevel >= threshold * 0.5) return "Low Stock";
    return "Critical";
  };

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedData = [...inventoryData].sort((a, b) => {
    if (sortConfig.key) {
      const direction = sortConfig.direction === 'ascending' ? 1 : -1;
      
      if (sortConfig.key === 'status') {
        const statusA = getStatus(a.stockLevel, a.threshold);
        const statusB = getStatus(b.stockLevel, b.threshold);
        return statusA.localeCompare(statusB) * direction;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return -1 * direction;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return 1 * direction;
      }
    }
    return 0;
  });

  // Apply filtering and searching
  const filteredData = sortedData.filter((item) => {
    const status = getStatus(item.stockLevel, item.threshold);
    const matchesFilter =
      filter === "all" ||
      (filter === "low" && status === "Low Stock") ||
      (filter === "critical" && status === "Critical");

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Stock Level Monitoring
      </h1>

      {/* Display Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search item..."
          className="border p-2 rounded-lg w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-[#283593] text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "low" ? "bg-[#FFA500] text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("low")}
          >
            Low Stock
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "critical" ? "bg-[#FF6347] text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("critical")}
          >
            Critical
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-[#283593] text-white">
                  <th className="py-2 px-4 text-left cursor-pointer" onClick={() => requestSort('name')}>
                    Item Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 text-left cursor-pointer" onClick={() => requestSort('category')}>
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 text-left cursor-pointer" onClick={() => requestSort('department')}>
                    Department {sortConfig.key === 'department' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 text-left cursor-pointer" onClick={() => requestSort('stockLevel')}>
                    Stock Level {sortConfig.key === 'stockLevel' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 text-left cursor-pointer" onClick={() => requestSort('threshold')}>
                    Threshold {sortConfig.key === 'threshold' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 text-left cursor-pointer" onClick={() => requestSort('status')}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => {
                  const status = getStatus(item.stockLevel, item.threshold);
                  return (
                    <tr key={item._id} className="border-t">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.category}</td>
                      <td className="py-2 px-4">{item.department}</td>
                      <td className="py-2 px-4">{item.stockLevel}</td>
                      <td className="py-2 px-4">{item.threshold}</td>
                      <td
                        className={`py-2 px-4 font-semibold ${
                          status === "OK"
                            ? "text-green-600"
                            : status === "Low Stock"
                            ? "text-orange-500"
                            : "text-red-600"
                        }`}
                      >
                        {status}
                      </td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-gray-500 font-semibold"
                    >
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockLevelMonitoring;
