import { NextResponse } from 'next/server';
import { MOCK_INCIDENTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: MOCK_INCIDENTS.length,
    incidents: MOCK_INCIDENTS,
  });
}
