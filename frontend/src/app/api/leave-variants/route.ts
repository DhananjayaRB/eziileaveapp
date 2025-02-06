import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const { searchParams } = new URL(request.url);
  const leaveTypeId = searchParams.get("leaveTypeId");

  try {
    const response = await fetch(
      `https://eziileave-api.azurewebsites.net/api/leave-variant/${leaveTypeId}`,
      {
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch leave variants");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching leave variants:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch leave variants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");
    const { searchParams } = new URL(request.url);
    const leaveTypeId = searchParams.get("leaveTypeId");

    const response = await fetch(
      `https://eziileave-api.azurewebsites.net/api/leave-variant/${leaveTypeId}`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create leave variant");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error creating leave variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create leave variant" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const { searchParams } = new URL(request.url);
  const leaveTypeId = searchParams.get("leaveTypeId");

  try {
    const response = await fetch(
      `https://eziileave-api.azurewebsites.net/api/leave-variant/${leaveTypeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete leave variant");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error deleting leave variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete leave variant" },
      { status: 500 }
    );
  }
}
