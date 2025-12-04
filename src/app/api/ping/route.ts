import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { 
        message: "pong",
        timestamp: new Date().toISOString(),
        status: "ok"
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error('Ping endpoint error:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "Failed to process ping request"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    return NextResponse.json(
      { 
        message: "pong",
        echo: body,
        method: "POST",
        timestamp: new Date().toISOString(),
        status: "ok"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ping POST endpoint error:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "Failed to process ping request"
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    }
  });
}