const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AccessiCheck Backend Running! 🚀' });
});

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  isConnected = true;
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () => {
    console.log('✅ Server running on port', process.env.PORT || 5000);
  });
}

module.exports = app;