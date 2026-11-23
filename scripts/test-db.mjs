import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

// Fix for Node.js on Windows where local router DNS fails SRV queries for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

// Parse .env.local file
const envPath = path.resolve(process.cwd(), '.env.local');
let mongoUri = 'mongodb://localhost:27017/lifelinex';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (match && match[1]) {
    mongoUri = match[1].trim().replace(/^["']|["']$/g, '');
  }
}

console.log('\n=================================================');
console.log('🩺 LifeLineX - MongoDB Connection Health Checker');
console.log('=================================================');
console.log(`Connecting to: ${mongoUri.replace(/:([^@]+)@/, ':****@')}\n`);

const startTime = Date.now();

try {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  const duration = Date.now() - startTime;
  const db = mongoose.connection;

  console.log('✅ STATUS: CONNECTED SUCCESSFULLY!');
  console.log(`⏱️ Response Time: ${duration}ms`);
  console.log(`📁 Database Name: ${db.name}`);
  console.log(`🌐 Host: ${db.host}`);
  console.log(`🔌 Ready State: ${db.readyState === 1 ? '1 (Connected)' : db.readyState}`);
  console.log('\n🎉 Your database is configured and ready for LifeLineX.\n');
  
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  const duration = Date.now() - startTime;
  console.log('❌ STATUS: CONNECTION FAILED');
  console.log(`⏱️ Time taken: ${duration}ms`);
  console.log(`⚠️ Error Message: ${error.message}\n`);
  
  console.log('💡 HOW TO FIX THIS:');
  console.log('1. If using MongoDB Atlas (Cloud):');
  console.log('   - Make sure your IP address is whitelisted (Network Access -> Allow Access from Anywhere 0.0.0.0/0).');
  console.log('   - Check username & password in your MONGODB_URI inside .env.local.');
  console.log('2. If using Local MongoDB Compass:');
  console.log('   - Make sure the local MongoDB service is running (mongod or MongoDB Windows Service).');
  console.log('   - Default local URI: mongodb://localhost:27017/lifelinex\n');

  process.exit(1);
}
