import { NextRequest, NextResponse } from 'next/server';

// Use environment variable with fallback to localhost
const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_a_id, product_b_id } = body;

    if (!product_a_id || !product_b_id) {
      return NextResponse.json(
        { error: 'product_a_id and product_b_id are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${CHATBOT_API_URL}/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        product_a_id,
        product_b_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Compare API error:', errorText);
      return NextResponse.json(
        { error: `API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying compare request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to connect to compare API',
        details: errorMessage,
        hint: 'Make sure the chatbot backend is running on ' + CHATBOT_API_URL
      },
      { status: 500 }
    );
  }
}

