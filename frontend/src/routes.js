import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import InventoryManagement from './pages/inventoryManagement';
import StockLevel from "./pages/stockLevel";
import OrderManagement from "./pages/oderManagement";
import NewOrderForm from "./pages/newOrderForm";
import DeliveryReconciliation from "./pages/deliveryAndReconciliation";
import InventoryUsageTracking from "./pages/invenroryUsageTracking";
import NewUsageEntry from "./pages/newUsageEntry";
import WastageLossTracking from "./pages/wastageLossTracking";
import NewWastageEntry from "./pages/newWastageEntry";
import ReportsAnalytics from "./pages/report";
import Login from './pages/login';
import Signup from './pages/signup';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/inventory-management" element={<InventoryManagement />} />
      <Route path="/stock-level" element={<StockLevel />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/orders/new" element={<NewOrderForm />} />
      <Route path="/delivery" element={<DeliveryReconciliation />} />
      <Route path="/usage-tracking" element={<InventoryUsageTracking />} />
      <Route path="/usage/new" element={<NewUsageEntry />} />
      <Route path="/wastage-loss" element={<WastageLossTracking />} />
      <Route path="/wastage/new" element={<NewWastageEntry />} />
      <Route path="/reports" element={<ReportsAnalytics />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
