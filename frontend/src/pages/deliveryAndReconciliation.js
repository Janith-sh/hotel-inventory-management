import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleDeliveries = [
  {
    id: 1,
    supplier: "ABC Supplies",
    item: "Toothpaste",
    orderedQuantity: 100,
    receivedQuantity: 95,
    deliveryDate: "2025-04-26",
    status: "Partial",
  },
  {
    id: 2,
    supplier: "FreshFoods Co",
    item: "Rice Bags",
    orderedQuantity: 50,
    receivedQuantity: 50,
    deliveryDate: "2025-04-25",
    status: "Complete",
  },
  {
    id: 3,
    supplier: "CleanPlus",
    item: "Hand Sanitizers",
    orderedQuantity: 200,
    receivedQuantity: 180,
    deliveryDate: "2025-04-24",
    status: "Partial",
  },
];

const DeliveryReconciliation = () => {
  const navigate = useNavigate();
  const [deliveries] = useState(sampleDeliveries);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Delivery & Stock Reconciliation
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Total Deliveries</h2>
          <p className="text-gray-600">{deliveries.length} Deliveries</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">On-time Deliveries</h2>
          <p className="text-green-600">80% On-time</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#4B5563]">Discrepancies Found</h2>
          <p className="text-[#FF6347]">
            {
              deliveries.filter(
                (d) => d.orderedQuantity !== d.receivedQuantity
              ).length
            }{" "}
            Issues
          </p>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#283593]">Delivery Records</h2>
          <button
            onClick={() => navigate("/orders/new")}
            className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
          >
            New Delivery
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="bg-[#283593] text-white">
                <th className="py-2 px-4 text-left">Supplier</th>
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-left">Ordered</th>
                <th className="py-2 px-4 text-left">Received</th>
                <th className="py-2 px-4 text-left">Delivery Date</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Discrepancy</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="border-t">
                  <td className="py-2 px-4">{delivery.supplier}</td>
                  <td className="py-2 px-4">{delivery.item}</td>
                  <td className="py-2 px-4">{delivery.orderedQuantity}</td>
                  <td className="py-2 px-4">{delivery.receivedQuantity}</td>
                  <td className="py-2 px-4">{delivery.deliveryDate}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        delivery.status === "Complete"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {delivery.orderedQuantity !== delivery.receivedQuantity ? (
                      <span className="text-[#EF4444] font-semibold">Yes</span>
                    ) : (
                      <span className="text-green-600 font-semibold">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReconciliation;
