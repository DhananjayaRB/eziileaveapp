import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    const response = await fetch("http://localhost:4000/api/leave-type", {
      headers: {
        Authorization: authHeader || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leave types");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching leave types:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { id, isActive } = await request.json();

    const response = await fetch(`http://localhost:4000/api/leave-type/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error("Failed to update leave type");
    }

    const updatedData = await response.json();
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error updating leave type:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
