import { NextResponse } from 'next/server';
import { INITIAL_METRICS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    metrics: INITIAL_METRICS,
    systemStatus: 'NOMINAL',
    nodesActive: 8420,
    timestamp: new Date().toISOString(),
  });
}
