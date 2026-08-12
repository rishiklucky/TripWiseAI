const mongoose = require('mongoose');
const dns = require('dns');

// Fix Node.js SRV DNS lookup issues on Windows
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore if not supported in older node
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripwise_ai';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    // If SRV lookup failed, try setting public DNS servers (Google 8.8.8.8) and retry once
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.log('[MongoDB] Retrying connection with public DNS (8.8.8.8)...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const retryConn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log(`[MongoDB] Connected successfully via Public DNS: ${retryConn.connection.host}`);
        return;
      } catch (retryErr) {
        error = retryErr;
      }
    }

    console.warn(`[MongoDB Warning] Could not connect to MongoDB Atlas / Local MongoDB: ${error.message}`);
    console.warn(`[MongoDB Warning] Application will run in stateless mode for unauthenticated features or mock data fallback.`);
  }
};

module.exports = connectDB;

