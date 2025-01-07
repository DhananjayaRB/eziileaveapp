import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await fetch(
      "http://localhost:4000/api/employee/leave-details",
      {
        headers: {
          Authorization: authHeader || "",
        },
      }
    );
    const data = await response.json();

    if (response.status === 404) {
      return NextResponse.json(null);
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch employee leave details");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching employee leave details:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
