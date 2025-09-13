import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaCheck, FaHourglassHalf, FaTimes } from "react-icons/fa";
import axios from "axios";

const DeliveryReconciliation = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [receivedQty, setReceivedQty] = useState(0);

  // Fetch orders from the database
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Fetched orders for delivery:', response.data);
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError('Failed to load delivery data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (delivery) => {
    setSelectedDelivery(delivery);
    setReceivedQty(delivery.receivedQuantity || 0);
    setShowModal(true);
  };

  const updateDeliveryStatus = async (statusAction) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Determine the actual status based on received quantity
      let actualStatus = 'Pending';
      let finalReceivedQty = receivedQty;
      
      if (statusAction === 'Cancel') {
        actualStatus = 'Cancelled';
        finalReceivedQty = 0;
      } else {
        // Auto-determine status based on received quantity
        if (finalReceivedQty === 0) {
          actualStatus = 'Pending';
        } else if (finalReceivedQty > 0 && finalReceivedQty < selectedDelivery.quantity) {
          actualStatus = 'Partial';
        } else if (finalReceivedQty === selectedDelivery.quantity) {
          actualStatus = 'Complete';
        }
      }
      
      console.log('Updating order status:', {
        orderId: selectedDelivery._id,
        status: actualStatus,
        receivedQuantity: finalReceivedQty,
        orderedQuantity: selectedDelivery.quantity
      });

      const response = await axios.put(
        `/api/orders/${selectedDelivery._id}/status`,
        {
          status: actualStatus,
          receivedQuantity: finalReceivedQty,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the deliveries list with the updated order
      const updatedDeliveries = deliveries.map((d) =>
        d._id === selectedDelivery._id ? response.data : d
      );
      
      setDeliveries(updatedDeliveries);
      setShowModal(false);
      
      // Refresh the data to get the latest state
      await fetchDeliveries();
      
      // Show success message
      alert(`Delivery status updated to ${actualStatus} successfully!`);
      
    } catch (error) {
      console.error("Error updating delivery:", error);
      alert("Error updating delivery status: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Delivery & Stock Reconciliation
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Total Orders</h2>
          <p className="text-gray-600">{deliveries.length} Orders</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Completed Deliveries</h2>
          <p className="text-green-600">
            {deliveries.filter(d => d.status === 'Complete').length} Complete
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Pending Orders</h2>
          <p className="text-[#FF6347]">
            {deliveries.filter(d => d.status === 'Pending').length} Pending
          </p>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#283593]">Delivery Records</h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading deliveries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button 
                onClick={fetchDeliveries}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No orders found for delivery.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr className="bg-[#283593] text-white">
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Supplier</th>
                  <th className="py-2 px-4 text-left">Item</th>
                  <th className="py-2 px-4 text-left">Ordered</th>
                  <th className="py-2 px-4 text-left">Received</th>
                  <th className="py-2 px-4 text-left">Expected Delivery</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Discrepancy</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery._id} className="border-t">
                    <td className="py-2 px-4">{delivery.orderId}</td>
                    <td className="py-2 px-4">{delivery.supplier}</td>
                    <td className="py-2 px-4">{delivery.itemName || 'Unknown Item'}</td>
                    <td className="py-2 px-4">{delivery.quantity}</td>
                    <td className="py-2 px-4">{delivery.receivedQuantity || 0}</td>
                    <td className="py-2 px-4">
                      {new Date(delivery.expectedDeliveryDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          delivery.status === "Complete"
                            ? "bg-green-500"
                            : delivery.status === "Partial"
                            ? "bg-yellow-500"
                            : delivery.status === "Cancelled"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {delivery.quantity !== (delivery.receivedQuantity || 0) ? (
                        <span className="text-[#EF4444] font-semibold">Yes</span>
                      ) : (
                        <span className="text-green-600 font-semibold">No</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleStatusUpdate(delivery)}
                        className="bg-[#10B981] text-white p-2 rounded-full hover:bg-[#0e9f6e] flex items-center justify-center"
                        title="Update Delivery Status"
                        disabled={delivery.status === "Complete"}
                      >
                        {delivery.status === "Complete" ? (
                          <FaCheck className="w-4 h-4" />
                        ) : delivery.status === "Cancelled" ? (
                          <FaTimes className="w-4 h-4" />
                        ) : delivery.status === "Partial" ? (
                          <FaHourglassHalf className="w-4 h-4" />
                        ) : (
                          <FaBoxOpen className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Delivery Status</h3>
            
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <p><strong>Order ID:</strong> {selectedDelivery.orderId}</p>
              <p><strong>Item:</strong> {selectedDelivery.itemName || 'Unknown Item'}</p>
              <p><strong>Supplier:</strong> {selectedDelivery.supplier}</p>
              <p><strong>Ordered Quantity:</strong> {selectedDelivery.quantity}</p>
              <p><strong>Current Status:</strong> {selectedDelivery.status}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Received Quantity:
              </label>
              <input
                type="number"
                value={receivedQty}
                onChange={(e) => setReceivedQty(Number(e.target.value))}
                className="w-full p-2 border rounded"
                max={selectedDelivery.quantity}
                min={0}
                placeholder="Enter received quantity"
              />
              <p className="text-xs text-gray-500 mt-1">
                Status will be: {receivedQty === 0 ? 'Pending' : 
                receivedQty < selectedDelivery.quantity ? 'Partial' : 'Complete'}
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => updateDeliveryStatus("Update")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={receivedQty < 0 || receivedQty > selectedDelivery.quantity}
              >
                Update Status
              </button>
              <button
                onClick={() => updateDeliveryStatus("Cancel")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel Order
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryReconciliation;
