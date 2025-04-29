import React, { useState } from "react";
import { Link } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      supplier: "ABC Supplies",
      item: "Toothpaste",
      quantity: 100,
      orderDate: "2025-04-25",
      status: "Pending",
    },
    {
      id: "ORD002",
      supplier: "XYZ Traders",
      item: "Rice",
      quantity: 500,
      orderDate: "2025-04-20",
      status: "Delivered",
    },
    {
      id: "ORD003",
      supplier: "ABC Supplies",
      item: "Cleaning Spray",
      quantity: 50,
      orderDate: "2025-04-22",
      status: "Cancelled",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "all" || order.status.toLowerCase() === filter;
    const matchesSearch =
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Order Management
      </h1>

      {/* Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search supplier or item..."
          className="border p-2 rounded-lg w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-[##283593] text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "delivered" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("delivered")}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "cancelled" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </button>

          {/* Add New Order Button */}
          <Link
            to="/orders/new"
            className="bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-[#0e9f6e]"
          >
            + New Order
          </Link>
        </div>
      </div>

      {/* Order Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#283593] text-white">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Supplier</th>
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Order Date</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.supplier}</td>
                  <td className="py-2 px-4">{order.item}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">{order.orderDate}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      order.status === "Pending"
                        ? "text-blue-600"
                        : order.status === "Delivered"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500 font-semibold"
                  >
                    No orders found.
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

export default OrderManagement;
