import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewOrderForm = () => {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState({
    inventoryItem: "",
    supplier: "",
    quantity: "",
    expectedDeliveryDate: "",
    unitPrice: "",
    totalPrice: 0,
  });  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        const response = await axios.get("/api/inventory", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setInventoryItems(response.data);
          console.log("Loaded inventory items:", response.data);
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        setError("Failed to load inventory items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);
  const handleInventoryItemChange = (e) => {
    const selectedItem = inventoryItems.find(
      (item) => item._id === e.target.value
    );
    setOrderData((prev) => ({
      ...prev,
      inventoryItem: e.target.value,
      // Keep the existing unitPrice or set it from the selected item if available
      unitPrice: selectedItem?.unitPrice || prev.unitPrice || "",
      // Store the item name for reference
      itemName: selectedItem ? selectedItem.name : "",
    }));
    
    console.log("Selected item:", selectedItem);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => {
      const newData = { ...prev, [name]: value };
      // Calculate total price when quantity or unit price changes
      if (name === "quantity" || name === "unitPrice") {
        newData.totalPrice = newData.quantity * newData.unitPrice;
      }
      return newData;
    });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!orderData.inventoryItem || !orderData.supplier || !orderData.quantity || 
          !orderData.unitPrice || !orderData.expectedDeliveryDate) {
        alert("Please fill all required fields");
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Generate a unique order ID (timestamp + random number)
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 1000);
      const orderId = `ORD-${timestamp}-${randomNum}`;
      
      // Make sure quantity and prices are numbers
      const quantity = Number(orderData.quantity);
      const unitPrice = Number(orderData.unitPrice);
      const totalPrice = quantity * unitPrice;
      
      // Format the data for submission
      const orderPayload = {
        orderId,
        inventoryItem: orderData.inventoryItem,
        supplier: orderData.supplier,
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        status: 'Pending',
        orderDate: new Date(),
        expectedDeliveryDate: new Date(orderData.expectedDeliveryDate),
        itemName: orderData.itemName // Send the item name for display purposes
      };
      
      console.log("Submitting order payload:", orderPayload);
      
      // Submit the order with authorization header
      const response = await axios.post("/api/orders", orderPayload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Order created successfully:", response.data);
      
      // Show success message and navigate to orders page
      alert("Order created successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#283593]">
        Create New Order
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto"
      >        <div className="mb-4">
          <label className="block text-[#4B5563] font-semibold mb-2">Item</label>
          {loading ? (
            <div className="border p-2 rounded-lg w-full bg-gray-100 text-center">Loading items...</div>
          ) : error ? (
            <div className="border p-2 rounded-lg w-full bg-red-100 text-red-700 text-center">{error}</div>
          ) : (
            <select
              name="inventoryItem"
              value={orderData.inventoryItem}
              onChange={handleInventoryItemChange}
              required
              className="border p-2 rounded-lg w-full"
            >
              <option value="">Select Inventory Item</option>
              {inventoryItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} (Current Stock: {item.stockLevel || 0}) - {item.category}
                </option>
              ))}
            </select>
          )}
          {inventoryItems.length === 0 && !loading && !error && (
            <p className="text-sm text-yellow-600 mt-1">No inventory items found. You might need to add items first.</p>
          )}
        </div>

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
            Unit Price
          </label>
          <input
            type="number"
            name="unitPrice"
            value={orderData.unitPrice}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full"
            placeholder="Enter Unit Price"
            min={0}
            step="0.01"
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

        <div className="mb-4">
          <label className="block text-[#4B5563] font-semibold mb-2">
            Total Price
          </label>
          <input
            type="number"
            value={orderData.totalPrice}
            className="border p-2 rounded-lg w-full bg-gray-100"
            disabled
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
