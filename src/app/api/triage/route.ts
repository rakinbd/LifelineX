import { NextResponse } from 'next/server';
import { analyzeEmergencyText } from '@/lib/ai/triageEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Emergency distress text description is required.' },
        { status: 400 }
      );
    }

    const triage = await analyzeEmergencyText(text);

    return NextResponse.json({
      success: true,
      triage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI triage pipeline', details: (error as Error).message },
      { status: 500 }
    );
  }
}
