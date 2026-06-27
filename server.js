const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'AccessiCheck Backend Running! 🚀' });
});

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB Error:', err);
  });