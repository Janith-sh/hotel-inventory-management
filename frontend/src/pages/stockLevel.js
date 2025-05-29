import React, { useState } from "react";

const StockLevelMonitoring = () => {
  const [inventoryData, setInventoryData] = useState([
    {
      id: 1,
      name: "Toothpaste",
      category: "Consumable",
      department: "Housekeeping",
      stockLevel: 12,
      threshold: 20,
    },
    {
      id: 2,
      name: "Rice",
      category: "Perishable Goods",
      department: "Kitchen",
      stockLevel: 50,
      threshold: 100,
    },
    {
      id: 3,
      name: "Bedsheet",
      category: "Fixed Asset",
      department: "Housekeeping",
      stockLevel: 30,
      threshold: 10,
    },
    {
      id: 4,
      name: "Cleaning Spray",
      category: "Consumable",
      department: "Housekeeping",
      stockLevel: 5,
      threshold: 15,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const getStatus = (stockLevel, threshold) => {
    if (stockLevel >= threshold) return "OK";
    if (stockLevel < threshold && stockLevel >= threshold * 0.5) return "Low Stock";
    return "Critical";
  };

  const filteredData = inventoryData.filter((item) => {
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
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#283593] text-white">
                <th className="py-2 px-4 text-left">Item Name</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Department</th>
                <th className="py-2 px-4 text-left">Stock Level</th>
                <th className="py-2 px-4 text-left">Threshold</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const status = getStatus(item.stockLevel, item.threshold);
                return (
                  <tr key={item.id} className="border-t">
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
      </div>
    </div>
  );
};

export default StockLevelMonitoring;
