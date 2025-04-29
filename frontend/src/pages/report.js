import React from "react";

const ReportsAnalytics = () => {
  // Simulate report generation
  const handleGenerateReport = (type) => {
    alert(`Generating ${type}...`);
    // In future, you can connect this to backend to download a PDF/CSV
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">Reports & Data Analytics</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Total Stock</h2>
          <p className="text-gray-600">5,200 Units</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Monthly Usage</h2>
          <p className="text-gray-600">1,250 Units Used</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Wastage Rate</h2>
          <p className="text-[#FF6347]">4.5%</p>
        </div>
      </div>

      {/* Data Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4 text-[#283593]">Stock Movement Overview</h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
          {/* Placeholder for future chart */}
          Graph/Chart Placeholder
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-[#283593]">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock Report */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#4B5563]">Stock Report</h3>
              <p className="text-gray-500 text-sm">Download detailed stock levels by item and category.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Stock Report")}
              className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767]"
            >
              Generate
            </button>
          </div>

          {/* Usage Report */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#4B5563]">Usage Report</h3>
              <p className="text-gray-500 text-sm">Monthly consumption breakdown by department.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Usage Report")}
              className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767]"
            >
              Generate
            </button>
          </div>

          {/* Wastage Report */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#4B5563]">Wastage Report</h3>
              <p className="text-gray-500 text-sm">Summary of damaged, spoiled, or lost inventory items.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Wastage Report")}
              className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767]"
            >
              Generate
            </button>
          </div>

          {/* Supplier Performance */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#4B5563]">Supplier Performance</h3>
              <p className="text-gray-500 text-sm">Track delivery reliability and quality by suppliers.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Supplier Performance Report")}
              className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767]"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
