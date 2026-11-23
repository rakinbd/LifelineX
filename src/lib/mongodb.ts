import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js on Windows where local ISP/router DNS fails SRV lookups for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifelinex';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase() {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  const currentUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifelinex';

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(currentUri, opts).then((m) => {
      console.log('✅ Connected to MongoDB successfully. DB:', m.connection.name);
      return m;
    }).catch((err) => {
      console.warn('⚠️ MongoDB connection attempt note:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
