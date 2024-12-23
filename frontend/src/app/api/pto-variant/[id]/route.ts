import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");

    const response = await fetch(
      `http://localhost:4000/api/pto-variant/${params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete PTO variant");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error deleting PTO variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete PTO variant" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    const body = await req.json();

    const response = await fetch(
      `http://localhost:4000/api/pto-variant/${params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update PTO variant");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating PTO variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update PTO variant" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    const response = await fetch(
      `http://localhost:4000/api/pto-variant-details/${params.id}`,
      {
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch PTO variant");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching PTO variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch PTO variant" },
      { status: 500 }
    );
  }
}
