export async function GET(request: Request) {
  try {
    return Response.json({ status: "ok" });
  } catch (error) {
    console.error('Test API error:', error);
    return Response.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    return Response.json({ status: "ok" });
  } catch (error) {
    console.error('Test API error:', error);
    return Response.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}