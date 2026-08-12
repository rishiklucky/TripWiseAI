const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const PORT = env.port;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 TripWise AI Backend Server running on port ${PORT}`);
    console.log(`🌐 AI Provider Engine: ${env.ai.provider.toUpperCase()}`);
    console.log(`====================================================`);
  });
};

startServer();
