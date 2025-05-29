import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewOrderForm = () => {
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    supplier: "",
    item: "",
    quantity: "",
    expectedDeliveryDate: "",
  });

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Order Data:", orderData);

    // Here you would normally send the orderData to your backend API

    // After submitting, navigate back to the orders page
    navigate("/orders");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Create New Order
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto"
      >
        <div className="mb-4">
          <label className="block text-[#4B5563] font-semibold mb-2">
            Supplier Name
          </label>
          <input
            type="text"
            name="supplier"
            value={orderData.supplier}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full"
            placeholder="Enter Supplier Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#4B5563] font-semibold mb-2">
            Item Name
          </label>
          <input
            type="text"
            name="item"
            value={orderData.item}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full"
            placeholder="Enter Item Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#4B5563] font-semibold mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={orderData.quantity}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full"
            placeholder="Enter Quantity"
            min={1}
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#4B5563] font-semibold mb-2">
            Expected Delivery Date
          </label>
          <input
            type="date"
            name="expectedDeliveryDate"
            value={orderData.expectedDeliveryDate}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-[#0e9f6e]"
          >
            Submit Order
          </button>

          <button
            type="button"
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/orders")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrderForm;
