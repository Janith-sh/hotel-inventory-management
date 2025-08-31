import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStock: 0,
    monthlyUsage: 0,
    monthlyWastage: 0,
    wastageRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/reports/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStats(response.data);
        
        // Create chart data
        setChartData({
          stockMovement: {
            labels: ['Current Stock', 'Monthly Usage', 'Monthly Wastage'],
            datasets: [{
              label: 'Quantity',
              data: [response.data.totalStock, response.data.monthlyUsage, response.data.monthlyWastage],
              backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 99, 132, 0.8)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
            }]
          },
          wastageBreakdown: {
            labels: ['Usage', 'Wastage'],
            datasets: [{
              data: [response.data.monthlyUsage, response.data.monthlyWastage],
              backgroundColor: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 99, 132, 0.8)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 2
            }]
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  // Generate and download report
  const handleGenerateReport = async (reportType) => {
    try {
      setGeneratingReport(reportType);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      let endpoint = '';
      switch (reportType) {
        case 'Stock Report':
          endpoint = '/api/reports/stock-report';
          break;
        case 'Usage Report':
          endpoint = '/api/reports/usage-report';
          break;
        case 'Wastage Report':
          endpoint = '/api/reports/wastage-report';
          break;
        case 'Supplier Performance Report':
          endpoint = '/api/reports/supplier-report';
          break;
        default:
          throw new Error('Invalid report type');
      }

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Generate PDF report
      generatePDFReport(response.data, reportType);
      
    } catch (error) {
      console.error(`Error generating ${reportType}:`, error);
      alert(`Failed to generate ${reportType}. Please try again.`);
    } finally {
      setGeneratingReport(null);
    }
  };

  // Generate PDF report
  const generatePDFReport = (data, reportType) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40, 53, 147); // #283593
    pdf.text('Hotel Inventory Management System', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.text(data.reportType, pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated on: ${new Date(data.generatedAt).toLocaleString()}`, pageWidth / 2, 45, { align: 'center' });
    
    // Reset text color
    pdf.setTextColor(0);
    
    let yPosition = 60;

    switch (reportType) {
      case 'Stock Report':
        // eslint-disable-next-line no-unused-vars
        yPosition = generateStockReportPDF(pdf, data, yPosition);
        break;
      case 'Usage Report':
        // eslint-disable-next-line no-unused-vars
        yPosition = generateUsageReportPDF(pdf, data, yPosition);
        break;
      case 'Wastage Report':
        // eslint-disable-next-line no-unused-vars
        yPosition = generateWastageReportPDF(pdf, data, yPosition);
        break;
      case 'Supplier Performance Report':
        // eslint-disable-next-line no-unused-vars
        yPosition = generateSupplierReportPDF(pdf, data, yPosition);
        break;
      default:
        console.warn(`Unknown report type: ${reportType}`);
        break;
    }

    // Save the PDF
    const filename = `${reportType.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  };

  // PDF generation functions for different report types
  const generateStockReportPDF = (pdf, data, startY) => {
    // Summary section
    pdf.setFontSize(12);
    pdf.text('Summary', 20, startY);
    startY += 10;
    
    pdf.setFontSize(10);
    pdf.text(`Total Items: ${data.totalItems}`, 25, startY);
    pdf.text(`Critical Items: ${data.criticalItems}`, 25, startY + 8);
    pdf.text(`Low Stock Items: ${data.lowStockItems}`, 25, startY + 16);
    
    startY += 35;

    // Table
    const tableColumns = [
      'Item Name', 'Category', 'Department', 'Current Stock', 'Threshold', 'Status'
    ];
    
    const tableRows = data.data.map(item => [
      item.itemName,
      item.category,
      item.department,
      item.currentStock.toString(),
      item.threshold.toString(),
      item.status
    ]);

    autoTable(pdf, {
      startY: startY,
      head: [tableColumns],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 53, 147] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      didDrawCell: function (data) {
        // Color code status cells
        if (data.column.index === 5 && data.cell.section === 'body') {
          const status = data.cell.text[0];
          if (status === 'Critical') {
            data.cell.styles.textColor = [220, 53, 69];
          } else if (status === 'Low Stock') {
            data.cell.styles.textColor = [255, 193, 7];
          } else {
            data.cell.styles.textColor = [40, 167, 69];
          }
        }
      }
    });

    return pdf.lastAutoTable.finalY + 10;
  };

  const generateUsageReportPDF = (pdf, data, startY) => {
    // Summary section
    pdf.setFontSize(12);
    pdf.text('Usage Summary', 20, startY);
    startY += 10;
    
    pdf.setFontSize(10);
    const periodStart = new Date(data.period.start).toLocaleDateString();
    const periodEnd = new Date(data.period.end).toLocaleDateString();
    pdf.text(`Period: ${periodStart} - ${periodEnd}`, 25, startY);
    pdf.text(`Total Records: ${data.totalRecords}`, 25, startY + 8);
    pdf.text(`Total Quantity Used: ${data.totalQuantityUsed}`, 25, startY + 16);
    
    startY += 35;

    // Department breakdown
    pdf.setFontSize(12);
    pdf.text('Department Breakdown', 20, startY);
    startY += 10;

    const deptColumns = ['Department', 'Total Quantity', 'Records', 'Unique Items'];
    const deptRows = Object.entries(data.departmentBreakdown).map(([dept, info]) => [
      dept,
      info.totalQuantity.toString(),
      info.records.toString(),
      info.uniqueItems.toString()
    ]);

    autoTable(pdf, {
      startY: startY,
      head: [deptColumns],
      body: deptRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 53, 147] },
    });

    startY = pdf.lastAutoTable.finalY + 20;

    // Detailed records
    if (startY > pdf.internal.pageSize.height - 60) {
      pdf.addPage();
      startY = 20;
    }

    pdf.setFontSize(12);
    pdf.text('Detailed Usage Records', 20, startY);
    startY += 10;

    const detailColumns = ['Date', 'Item', 'Department', 'Quantity', 'Previous Stock', 'New Stock'];
    const detailRows = data.detailedRecords.slice(0, 50).map(record => [ // Limit to 50 records for PDF size
      new Date(record.date).toLocaleDateString(),
      record.item,
      record.department,
      record.quantity.toString(),
      record.previousStock.toString(),
      record.newStock.toString()
    ]);

    autoTable(pdf, {
      startY: startY,
      head: [detailColumns],
      body: detailRows,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [40, 53, 147] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    return pdf.lastAutoTable.finalY + 10;
  };

  const generateWastageReportPDF = (pdf, data, startY) => {
    // Summary section
    pdf.setFontSize(12);
    pdf.text('Wastage Summary', 20, startY);
    startY += 10;
    
    pdf.setFontSize(10);
    const periodStart = new Date(data.period.start).toLocaleDateString();
    const periodEnd = new Date(data.period.end).toLocaleDateString();
    pdf.text(`Period: ${periodStart} - ${periodEnd}`, 25, startY);
    pdf.text(`Total Records: ${data.totalRecords}`, 25, startY + 8);
    pdf.text(`Total Quantity Wasted: ${data.totalQuantityWasted}`, 25, startY + 16);
    
    startY += 35;

    // Reason breakdown
    pdf.setFontSize(12);
    pdf.text('Wastage Reasons Breakdown', 20, startY);
    startY += 10;

    const reasonColumns = ['Reason', 'Total Quantity', 'Records', 'Unique Items'];
    const reasonRows = Object.entries(data.reasonBreakdown).map(([reason, info]) => [
      reason,
      info.totalQuantity.toString(),
      info.records.toString(),
      info.uniqueItems.toString()
    ]);

    autoTable(pdf, {
      startY: startY,
      head: [reasonColumns],
      body: reasonRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 53, 147] },
    });

    startY = pdf.lastAutoTable.finalY + 20;

    // Detailed records
    if (startY > pdf.internal.pageSize.height - 60) {
      pdf.addPage();
      startY = 20;
    }

    pdf.setFontSize(12);
    pdf.text('Detailed Wastage Records', 20, startY);
    startY += 10;

    const detailColumns = ['Date', 'Item', 'Department', 'Quantity', 'Reason', 'Status'];
    const detailRows = data.detailedRecords.slice(0, 50).map(record => [
      new Date(record.date).toLocaleDateString(),
      record.item,
      record.department,
      record.quantity.toString(),
      record.reason,
      record.status
    ]);

    autoTable(pdf, {
      startY: startY,
      head: [detailColumns],
      body: detailRows,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [40, 53, 147] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    return pdf.lastAutoTable.finalY + 10;
  };

  const generateSupplierReportPDF = (pdf, data, startY) => {
    // Summary section
    pdf.setFontSize(12);
    pdf.text('Supplier Performance Summary', 20, startY);
    startY += 10;
    
    pdf.setFontSize(10);
    const periodStart = new Date(data.period.start).toLocaleDateString();
    const periodEnd = new Date(data.period.end).toLocaleDateString();
    pdf.text(`Period: ${periodStart} - ${periodEnd}`, 25, startY);
    pdf.text(`Total Suppliers: ${data.totalSuppliers}`, 25, startY + 8);
    pdf.text(`Total Orders: ${data.totalOrders}`, 25, startY + 16);
    
    startY += 35;

    // Supplier performance table
    const supplierColumns = [
      'Supplier', 'Orders', 'Completed', 'Completion %', 'Fulfillment %', 'On-Time %'
    ];
    
    const supplierRows = Object.entries(data.supplierPerformance).map(([supplier, perf]) => [
      supplier,
      perf.totalOrders.toString(),
      perf.completedOrders.toString(),
      perf.completionRate + '%',
      perf.fulfillmentRate + '%',
      perf.onTimeRate + '%'
    ]);

    autoTable(pdf, {
      startY: startY,
      head: [supplierColumns],
      body: supplierRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 53, 147] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    return pdf.lastAutoTable.finalY + 10;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">Reports & Data Analytics</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#4B5563]">Total Stock</h2>
              <p className="text-gray-600">{stats.totalStock.toLocaleString()} Units</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#4B5563]">Monthly Usage</h2>
              <p className="text-gray-600">{stats.monthlyUsage.toLocaleString()} Units Used</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#4B5563]">Wastage Rate</h2>
              <p className="text-[#FF6347]">{stats.wastageRate}%</p>
            </div>
          </div>

          {/* Data Visualization */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#283593]">Stock Movement Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Current Stock</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStock}</p>
                <p className="text-sm text-blue-600">Total Units</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Monthly Usage</h3>
                <p className="text-2xl font-bold text-green-600">{stats.monthlyUsage}</p>
                <p className="text-sm text-green-600">Units Used</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Monthly Wastage</h3>
                <p className="text-2xl font-bold text-red-600">{stats.monthlyWastage || 0}</p>
                <p className="text-sm text-red-600">Units Wasted</p>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-center">Stock Movement</h3>
                {chartData && chartData.stockMovement ? (
                  <Bar 
                    data={chartData.stockMovement} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        },
                        title: {
                          display: false
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Loading chart...
                  </div>
                )}
              </div>

              {/* Doughnut Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-center">Usage vs Wastage</h3>
                {chartData && chartData.wastageBreakdown && (stats.monthlyUsage + stats.monthlyWastage > 0) ? (
                  <Doughnut 
                    data={chartData.wastageBreakdown} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        title: {
                          display: false
                        },
                      }
                    }}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    {stats.monthlyUsage + stats.monthlyWastage === 0 ? 'No usage/wastage data' : 'Loading chart...'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#283593]">Generate Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock Report */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#4B5563]">Stock Report</h3>
                  <p className="text-gray-500 text-sm">Download detailed stock levels by item and category with status indicators.</p>
                </div>
                <button
                  onClick={() => handleGenerateReport("Stock Report")}
                  className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={generatingReport === "Stock Report"}
                >
                  {generatingReport === "Stock Report" ? "Generating..." : "Generate PDF"}
                </button>
              </div>

              {/* Usage Report */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#4B5563]">Usage Report</h3>
                  <p className="text-gray-500 text-sm">Monthly consumption breakdown by department with detailed usage history.</p>
                </div>
                <button
                  onClick={() => handleGenerateReport("Usage Report")}
                  className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={generatingReport === "Usage Report"}
                >
                  {generatingReport === "Usage Report" ? "Generating..." : "Generate PDF"}
                </button>
              </div>

              {/* Wastage Report */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#4B5563]">Wastage Report</h3>
                  <p className="text-gray-500 text-sm">Summary of damaged, spoiled, or lost inventory items with reasons and trends.</p>
                </div>
                <button
                  onClick={() => handleGenerateReport("Wastage Report")}
                  className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={generatingReport === "Wastage Report"}
                >
                  {generatingReport === "Wastage Report" ? "Generating..." : "Generate PDF"}
                </button>
              </div>

              {/* Supplier Performance */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#4B5563]">Supplier Performance</h3>
                  <p className="text-gray-500 text-sm">Track delivery reliability, completion rates, and quality metrics by suppliers.</p>
                </div>
                <button
                  onClick={() => handleGenerateReport("Supplier Performance Report")}
                  className="mt-4 bg-[#283593] text-white px-4 py-2 rounded hover:bg-[#1e2767] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={generatingReport === "Supplier Performance Report"}
                >
                  {generatingReport === "Supplier Performance Report" ? "Generating..." : "Generate PDF"}
                </button>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Report Information</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Reports are generated in PDF format with professional formatting and tables</li>
                <li>• Usage and Wastage reports default to current month data</li>
                <li>• Supplier performance covers the last 6 months</li>
                <li>• All reports include real-time data from your inventory system</li>
                <li>• Charts and visualizations provide quick insights into stock movement patterns</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsAnalytics;
