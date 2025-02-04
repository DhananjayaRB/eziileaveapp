import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const workflowData = await request.json();
    const authHeader = request.headers.get("Authorization");
    const response = await fetch(`http://localhost:4000/api/workflow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(workflowData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create workflow");
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create workflow" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await fetch(`http://localhost:4000/api/workflow`, {
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch workflows");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflows", message: error.message },
      { status: 500 }
    );
  }
}
