import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';
import BloodRequestModel from '@/models/BloodRequest';
import DonorModel from '@/models/Donor';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    const conn = await connectToDatabase();
    const isConnected = conn.connection.readyState === 1;
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'success',
      database: 'MongoDB',
      connected: isConnected,
      host: conn.connection.host,
      databaseName: conn.connection.name,
      responseTimeMs: responseTime,
      message: 'MongoDB is connected and operational.',
      models: {
        User: Boolean(UserModel),
        BloodRequest: Boolean(BloodRequestModel),
        Donor: Boolean(DonorModel),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return NextResponse.json(
      {
        status: 'error',
        database: 'MongoDB',
        connected: false,
        responseTimeMs: responseTime,
        message: 'MongoDB is currently not connected.',
        error: error?.message || 'Connection error',
        hint: 'Check MONGODB_URI in .env.local. If using local MongoDB, ensure MongoDB service or Compass is running. If using Atlas, ensure IP whitelist (0.0.0.0/0) is enabled.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
