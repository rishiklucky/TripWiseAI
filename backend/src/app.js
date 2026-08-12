const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const travelRoutes = require('./routes/travelRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Body Parser & CORS
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/ai', aiRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'TripWise AI API is running smoothly',
    timestamp: new Date(),
  });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
