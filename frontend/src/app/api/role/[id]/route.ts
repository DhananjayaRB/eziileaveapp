import { NextResponse, NextRequest } from "next/server";

interface Props {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params: { id } }: Props) {
  try {
    const { ...roleData } = await request.json();
    const authHeader = request.headers.get("Authorization");
    const response = await fetch(`https://eziileave-api.azurewebsites.net/api/roles/${id}`, {
      method: "PUT",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    const updatedData = await response.json();

    if (!response.ok) {
      throw new Error(
        updatedData.error || updatedData.message || "Failed to update role"
      );
    }

    return NextResponse.json(updatedData);
  } catch (error: unknown) {
    console.error("Error updating roe:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update role" },
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
      `https://eziileave-api.azurewebsites.net/api/roles/${params.id}`,
      {
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch role");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch role" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    const response = await fetch(
      `https://eziileave-api.azurewebsites.net/api/roles/${params.id}`,
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
      throw new Error(data.message || "Failed to delete role");
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete role" },
      { status: 500 }
    );
  }
}
