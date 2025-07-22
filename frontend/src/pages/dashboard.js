import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { 
  getDashboardStats, 
  getStockReport, 
  getUsageReport, 
  getWastageReport, 
  getInventoryItems,
  getOrders 
} from "../utils/api";
import ErrorBoundary from "../components/ErrorBoundary";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    stockReport: null,
    usageReport: null,
    wastageReport: null,
    inventoryItems: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, stockReport, usageReport, wastageReport, inventoryItems, orders] = await Promise.all([
        getDashboardStats(),
        getStockReport(),
        getUsageReport(),
        getWastageReport(),
        getInventoryItems(),
        getOrders()
      ]);

      setDashboardData({
        stats,
        stockReport,
        usageReport,
        wastageReport,
        inventoryItems,
        orders
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate stock data by category
  const getStockData = () => {
    if (!dashboardData.inventoryItems.length) {
      return {
        labels: ["No Data"],
        datasets: [{
          label: "Stock Count",
          data: [0],
          backgroundColor: "#008080",
        }]
      };
    }

    const categoryStock = {};
    dashboardData.inventoryItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      categoryStock[category] = (categoryStock[category] || 0) + (item.currentStock || 0);
    });

    return {
      labels: Object.keys(categoryStock),
      datasets: [{
        label: "Stock Count",
        data: Object.values(categoryStock),
        backgroundColor: "#008080",
      }]
    };
  };

  // Generate wastage data by reason
  const getWastageData = () => {
    if (!dashboardData.wastageReport?.reasonBreakdown) {
      return {
        labels: ["Spoilage", "Breakage", "Theft"],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ["#EF4444", "#F59E0B", "#10B981"],
        }]
      };
    }

    const reasonBreakdown = dashboardData.wastageReport.reasonBreakdown;
    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#F97316"];
    
    return {
      labels: Object.keys(reasonBreakdown),
      datasets: [{
        data: Object.values(reasonBreakdown).map(reason => reason.totalQuantity),
        backgroundColor: colors.slice(0, Object.keys(reasonBreakdown).length),
      }]
    };
  };

  // Get low stock items
  const getLowStockItems = () => {
    if (!dashboardData.stockReport?.data) return [];
    return dashboardData.stockReport.data.filter(item => 
      item.status === 'Low Stock' || item.status === 'Critical'
    ).slice(0, 5); // Show only top 5
  };

  // Get department usage data
  const getDepartmentUsage = () => {
    if (!dashboardData.usageReport?.departmentBreakdown) return [];
    return Object.entries(dashboardData.usageReport.departmentBreakdown)
      .map(([department, data]) => ({
        department,
        totalQuantity: data.totalQuantity,
        records: data.records
      }))
      .slice(0, 5); // Show top 5 departments
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">
            <h3 className="font-semibold">Error loading dashboard</h3>
            <p className="mt-1">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stockData = getStockData();
  const wastageData = getWastageData();
  const lowStockItems = getLowStockItems();
  const departmentUsage = getDepartmentUsage();

  return (
    <ErrorBoundary>
      <div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#1a237e] mt-6">
              Inventory Dashboard
            </h1>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-[#008080] text-white rounded hover:bg-[#006666] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563]">
              Total Stock
            </h2>
            <p className="text-2xl font-bold text-[#008080]">
              {dashboardData.stats?.totalStock || 0}
            </p>
            <p className="text-sm text-gray-600">{dashboardData.stats?.totalItems || 0} unique items</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563]">
              Stock Alerts
            </h2>
            <div className="space-y-1">
              <p className="text-lg font-bold text-[#EF4444]">
                {dashboardData.stats?.criticalStockItems || 0}
              </p>
              <p className="text-sm text-red-600">Critical items</p>
              <p className="text-sm text-yellow-600">
                {dashboardData.stats?.lowStockItems || 0} low stock
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563]">
              Monthly Activity
            </h2>
            <div className="space-y-1">
              <p className="text-lg font-bold text-[#3B82F6]">
                {dashboardData.stats?.monthlyUsage || 0}
              </p>
              <p className="text-sm text-blue-600">Items used</p>
              <p className="text-sm text-red-600">
                {dashboardData.stats?.monthlyWastage || 0} wasted
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563]">
              Performance
            </h2>
            <div className="space-y-1">
              <p className="text-lg font-bold text-[#F59E0B]">
                {dashboardData.stats?.wastageRate || 0}%
              </p>
              <p className="text-sm text-yellow-600">Wastage rate</p>
              <p className="text-sm text-green-600">
                {dashboardData.stats?.pendingOrders || 0} pending orders
              </p>
            </div>
          </div>
        </div>

        {/* Alerts and Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563] mb-3">
              Low Stock Alerts
            </h2>
            {lowStockItems.length > 0 ? (
              <div className="space-y-2">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{item.itemName}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.status === 'Critical' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No low stock items</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563] mb-3">
              Recent Orders & Deliveries
            </h2>
            <div className="space-y-1">
              <p className="text-gray-600 text-sm">
                Pending Orders: {dashboardData.stats?.pendingOrders || 0}
              </p>
              <p className="text-gray-600 text-sm">
                Completed: {dashboardData.stats?.completedOrders || 0}
              </p>
              <p className="text-gray-600 text-sm">
                Recent Orders: {dashboardData.stats?.recentOrdersCount || 0}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563] mb-3">
              Inventory Summary
            </h2>
            <div className="space-y-1">
              <p className="text-gray-600 text-sm">
                Total Items: {dashboardData.inventoryItems.length}
              </p>
              <p className="text-gray-600 text-sm">
                Critical Stock: {dashboardData.stockReport?.criticalItems || 0}
              </p>
              <p className="text-gray-600 text-sm">
                Low Stock: {dashboardData.stockReport?.lowStockItems || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563] mb-4">
              Department-Wise Usage
            </h2>
            {departmentUsage.length > 0 ? (
              <ul className="text-gray-600 space-y-2">
                {departmentUsage.map((dept, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{dept.department}:</span>
                    <span className="font-semibold">{dept.totalQuantity} items</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">No usage data available</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#4B5563] mb-4">
              Wastage & Loss
            </h2>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pie 
                data={wastageData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563] mb-4">Stock by Category</h2>
          <div style={{ height: '400px' }}>
            <Bar 
              data={stockData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
