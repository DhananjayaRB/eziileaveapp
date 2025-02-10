import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const response = await fetch(`https://qa-api.resolveindia.com/leave/api/comp-off-variant`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch comp-off variants");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching comp-off variants:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch comp-off variants" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const body = await req.json();

    const response = await fetch(`https://qa-api.resolveindia.com/leave/api/comp-off-variant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create comp-off variant");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating comp-off variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create comp-off variant" },
      { status: 500 }
    );
  }
}
