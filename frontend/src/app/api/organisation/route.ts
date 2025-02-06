import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await fetch("https://eziileave-api.azurewebsites.net/api/organisation", {
      headers: {
        Authorization: authHeader || "",
      },
    });
    const data = await response.json();

    if (response.status === 404) {
      return NextResponse.json(null);
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch organisation");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching organisation:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await fetch("https://eziileave-api.azurewebsites.net/api/organisation", {
      method: "POST",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create organisation");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error creating organisation:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const body = await request.json();

    const response = await fetch("https://eziileave-api.azurewebsites.net/api/organisation", {
      method: "PATCH",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update organisation");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error updating organisation:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
