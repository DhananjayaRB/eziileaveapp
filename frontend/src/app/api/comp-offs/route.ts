import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await fetch("http://localhost:4000/api/comp-off", {
      headers: {
        Authorization: authHeader || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch comp off");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching comp off:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { isEnabled } = await request.json();

  try {
    const authHeader = request.headers.get("Authorization");
    const response = await fetch(`http://localhost:4000/api/comp-off`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isEnabled }),
    });

    const updatedData = await response.json();

    if (!response.ok) {
      throw new Error(updatedData.message || "Failed to update comp off");
    }

    return NextResponse.json(updatedData);
  } catch (error: unknown) {
    console.error("Error updating comp off:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
