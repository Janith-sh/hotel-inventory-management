const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const inventoryRoutes = require('./routes/inventoryRoutes');
const stockLevelRoutes = require('./routes/stockLevelRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const usageRoutes = require('./routes/usageRoutes');
const wastageRoutes = require('./routes/wastageRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
    : 'http://localhost:3000',
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shan Hotel Inventory Management API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Shan Hotel Inventory Management API',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stock-levels', stockLevelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/wastage', wastageRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
