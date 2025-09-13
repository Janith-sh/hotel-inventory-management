# Hotel Inventory Management System - Dashboard Setup Guide

## Overview
The dashboard has been enhanced to fetch real-time data from your backend API endpoints. It displays:

- **Dashboard Statistics**: Total stock, monthly usage, wastage, and wastage rate
- **Low Stock Alerts**: Critical and low stock items
- **Order Management**: Pending and completed orders summary
- **Interactive Charts**: Stock by category, wastage breakdown by reason
- **Department Usage**: Real-time usage tracking by department

## Setup Instructions

### Prerequisites
- Node.js installed on your system
- MongoDB connection (configured in backend/.env)
- Both backend and frontend dependencies installed

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Servers

**Start Backend Server:**
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000

**Start Frontend Server (in a new terminal):**
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

### 3. Access the Dashboard
1. Navigate to http://localhost:3000
2. Login with your credentials
3. Access the dashboard to see real-time data

## API Endpoints Used

The dashboard fetches data from the following backend endpoints:

- `GET /api/reports/dashboard-stats` - Overall statistics
- `GET /api/reports/stock-report` - Stock levels and alerts
- `GET /api/reports/usage-report` - Usage tracking data  
- `GET /api/reports/wastage-report` - Wastage and loss data
- `GET /api/inventory` - All inventory items
- `GET /api/orders` - Order information

## Features Implemented

### Real-time Data Display
- Total stock count across all categories
- Monthly usage and wastage statistics
- Wastage rate calculation
- Low stock and critical stock alerts

### Interactive Charts
- **Stock by Category Chart**: Bar chart showing stock levels grouped by category
- **Wastage Breakdown Chart**: Pie chart showing wastage by reason (spoilage, breakage, theft, etc.)

### Dashboard Sections
1. **Statistics Cards**: Key metrics at a glance
2. **Alert Panels**: Low stock warnings and order summaries
3. **Department Usage**: Real-time usage by department
4. **Visual Analytics**: Charts and graphs for trend analysis

### Error Handling
- Loading states for better user experience
- Error messages with retry functionality  
- Fallback data when no information is available
- Authentication token refresh automatically handled

### Authentication Integration
- Automatic token refresh on expiry
- Secure API calls with JWT authentication
- Redirect to login when authentication fails

## Troubleshooting

### Common Issues

1. **Dashboard shows "Loading..." forever:**
   - Check if backend server is running on port 5000
   - Verify MongoDB connection in backend console
   - Check browser console for API errors

2. **Authentication errors:**
   - Ensure you're logged in
   - Check if JWT tokens are stored in localStorage
   - Try logging out and logging back in

3. **No data displaying:**
   - Add some inventory items first
   - Create usage and wastage records for charts to display
   - Check backend console for any database errors

4. **Charts not rendering:**
   - Ensure Chart.js dependencies are installed
   - Check browser console for any JavaScript errors
   - Verify data format matches chart requirements

### API Response Formats

The dashboard expects specific response formats from the backend:

**Dashboard Stats Response:**
```json
{
  "totalStock": 1250,
  "monthlyUsage": 420,
  "monthlyWastage": 35,
  "wastageRate": 8.3
}
```

**Stock Report Response:**
```json
{
  "data": [
    {
      "itemName": "Item Name",
      "status": "Critical|Low Stock|OK",
      "currentStock": 10,
      "threshold": 50
    }
  ],
  "criticalItems": 2,
  "lowStockItems": 5
}
```

## Next Steps

1. **Add More Visualizations**: Consider adding trend charts over time
2. **Real-time Updates**: Implement WebSocket connections for live updates
3. **Export Functionality**: Add PDF/Excel export for dashboard data
4. **Custom Date Ranges**: Allow users to filter data by date ranges
5. **Notifications**: Implement push notifications for critical alerts

## File Structure

```
frontend/src/
├── utils/
│   ├── api.js          # API utility functions
│   └── auth.js         # Authentication utilities
└── pages/
    └── dashboard.js    # Main dashboard component
```

The dashboard is now fully integrated with your backend API and will display real-time data from your inventory management system.
