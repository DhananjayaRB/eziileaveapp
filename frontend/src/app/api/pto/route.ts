import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await fetch("https://eziileave-api.azurewebsites.net/api/pto", {
      headers: {
        Authorization: authHeader || "",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch pto");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching pto:", error);
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
    const response = await fetch(`https://eziileave-api.azurewebsites.net/api/pto`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isEnabled }),
    });

    const updatedData = await response.json();

    if (!response.ok) {
      throw new Error(updatedData.message || "Failed to update pto");
    }

    return NextResponse.json(updatedData);
  } catch (error: any) {
    console.error("Error updating pto:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
