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
    console.log(`🌐 Primary AI Provider: ${env.ai.primaryProvider.toUpperCase()}`);
    console.log(`🔄 Fallback AI Providers: ${env.ai.fallbackProvider.toUpperCase()}, ${env.ai.secondaryFallback.toUpperCase()}`);
    console.log(`====================================================`);
  });
};

startServer();
