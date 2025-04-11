import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement);

const Dashboard = () => {
  const stockData = {
    labels: ["Furniture", "Appliances", "Toiletries", "Food", "Beverages"],
    datasets: [
      {
        label: "Stock Count",
        data: [120, 90, 150, 200, 180],
        backgroundColor: "#008080",
      },
    ],
  };

  const wastageData = {
    labels: ["Spoilage", "Breakage", "Theft"],
    datasets: [
      {
        data: [30, 20, 10],
        backgroundColor: ["#EF4444", "#F59E0B", "#10B981"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#007BFF]">
        Inventory Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  
        <div className="bg-white p-4 rounded-lg shadow-md">  
          <h2 className="text-lg font-semibold text-[#4B5563]">  
            Total Inventory  
          </h2>  
          <p className="text-gray-600">Fixed Assets: 500</p>  
          <p className="text-gray-600">Consumables: 700</p>  
        </div>  

        <div className="bg-white p-4 rounded-lg shadow-md">  
          <h2 className="text-lg font-semibold text-[#4B5563]">  
            Low Stock Alerts  
          </h2>  
          <p className="text-[#FF6347]">  
            Toothpaste: Below threshold!  
          </p>  
          <p className="text-[#FF6347]">  
            Rice: Running low!  
          </p>  
        </div>  

        <div className="bg-white p-4 rounded-lg shadow-md">  
          <h2 className="text-lg font-semibold text-[#4B5563]">  
            Recent Orders & Deliveries  
          </h2>  
          <p className="text-gray-600">Pending Orders: 3</p>  
          <p className="text-gray-600">Delivered: 7 this week</p>  
        </div>  
      </div>  

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">  
        <div className="bg-white p-4 rounded-lg shadow-md">  
          <h2 className="text-lg font-semibold text-[#4B5563]">  
            Department-Wise Usage  
          </h2>  
          <ul className="text-gray-600">  
            <li>Housekeeping: 40 items used today</li>  
            <li>Kitchen: 60 items used today</li>  
          </ul>  
        </div>  

        <div className="bg-white p-4 rounded-lg shadow-md">  
          <h2 className="text-lg font-semibold text-[#4B5563]">  
            Wastage & Loss  
          </h2>  
          <Pie data={wastageData} />  
        </div>  
      </div>  

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">  
        <h2 className="text-lg font-semibold text-[#4B5563]">  
          Stock Trends  
        </h2>  
        <Bar data={stockData} />  
      </div>  
    </div>
  );
};

export default Dashboard;
