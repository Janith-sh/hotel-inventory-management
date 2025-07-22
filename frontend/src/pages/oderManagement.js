import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get("/api/orders", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Fetched orders:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "all" || 
      (order.status && order.status.toLowerCase() === filter);
      
    const matchesSearch =
      searchTerm === "" ||
      (order.supplier && order.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.itemName && order.itemName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Order Management
      </h1>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

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
              filter === "all" ? "bg-[#283593] text-white" : "bg-gray-200"
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
              filter === "complete" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("complete")}
          >
            Complete
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
          {loading ? (
            <div className="text-center py-4">Loading orders...</div>
          ) : (
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
              </thead>              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="py-2 px-4">{order.orderId}</td>
                    <td className="py-2 px-4">{order.supplier}</td>
                    <td className="py-2 px-4">{order.itemName || "Unknown Item"}</td>
                    <td className="py-2 px-4">{order.quantity}</td>
                    <td className="py-2 px-4">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        order.status === "Pending"
                          ? "text-blue-600"
                          : order.status === "Complete"
                          ? "text-green-600"
                          : order.status === "Partial"
                          ? "text-yellow-600"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
