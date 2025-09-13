import { getTokens, refreshTokens, clearTokens } from './auth';

const BASE_URL = 'https://janith-backend-bd5ce66c4d8a.herokuapp.com/';

// Helper function to make authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  let { accessToken } = getTokens();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // If token expired, try to refresh
    if (response.status === 401) {
      try {
        accessToken = await refreshTokens();
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(`${BASE_URL}${endpoint}`, config);
      } catch (error) {
        clearTokens();
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Dashboard API functions
export const getDashboardStats = () => {
  return apiCall('/reports/dashboard-stats');
};

export const getStockReport = () => {
  return apiCall('/reports/stock-report');
};

export const getUsageReport = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  return apiCall(`/reports/usage-report?${params.toString()}`);
};

export const getWastageReport = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  return apiCall(`/reports/wastage-report?${params.toString()}`);
};

export const getInventoryItems = () => {
  return apiCall('/inventory');
};

export const getOrders = () => {
  return apiCall('/orders');
};

export const getUsageRecords = () => {
  return apiCall('/usage');
};

export const getWastageRecords = () => {
  return apiCall('/wastage');
};
