import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    const response = await fetch(`http://localhost:4000/api/pto-variant`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch PTO variants");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching PTO variants:", error);
    return NextResponse.json(
      { error: "Failed to fetch PTO variants" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("Authorization");

    const response = await fetch(`http://localhost:4000/api/pto-variant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create PTO variant");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating PTO variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create PTO variant" },
      { status: 500 }
    );
  }
}
