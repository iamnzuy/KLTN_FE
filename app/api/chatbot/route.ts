import { NextRequest, NextResponse } from 'next/server';

// Use environment variable with fallback to localhost
const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:8000/chat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chatbot API error:', errorText);
      return NextResponse.json(
        { error: `API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying chatbot request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to connect to chatbot API',
        details: errorMessage,
        hint: 'Make sure the chatbot backend is running on ' + CHATBOT_API_URL
      },
      { status: 500 }
    );
  }
}

