import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://same-gbaeolh4sfm-latest.netlify.app'
    : 'http://localhost:3000';

  const testData = {
    email: 'admin@diginest.io',
    password: 'SecureAdmin123!',
    name: 'DigiNest Admin'
  };

  try {
    // First check if admin already exists
    const checkResponse = await fetch(`${baseUrl}/api/setup-admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const checkResult = await checkResponse.json();

    if (checkResult.hasAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        existingAdmins: checkResult.admins,
        adminCount: checkResult.adminCount
      });
    }

    // Create admin user
    const createResponse = await fetch(`${baseUrl}/api/setup-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const createResult = await createResponse.json();

    return NextResponse.json({
      checkResponse: checkResult,
      createResponse: createResult,
      success: createResponse.ok,
      statusCode: createResponse.status
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test admin setup',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const customData = await request.json();
    
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://same-gbaeolh4sfm-latest.netlify.app'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/setup-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customData)
    });

    const result = await response.json();

    return NextResponse.json({
      success: response.ok,
      statusCode: response.status,
      result
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to create admin',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}