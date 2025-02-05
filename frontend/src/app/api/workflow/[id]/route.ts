import { NextResponse, NextRequest } from "next/server";

interface Props {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params: { id } }: Props) {
  try {
    const { ...workflowData } = await request.json();
    const authHeader = request.headers.get("Authorization");

    const response = await fetch(`https://eziileave-api.azurewebsites.net/api/workflow/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(workflowData),
    });

    const updatedData = await response.json();

    if (!response.ok) {
      throw new Error(updatedData.message || "Failed to update workflow");
    }

    return NextResponse.json(updatedData);
  } catch (error: any) {
    console.error("Error updating workflow:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update workflow" },
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
      `https://eziileave-api.azurewebsites.net/api/workflow/${params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch workflow");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching workflow:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch workflow" },
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
      `https://eziileave-api.azurewebsites.net/api/workflow/${params.id}`,
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
      throw new Error(data.message || "Failed to delete workflow");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error deleting workflow:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete workflow" },
      { status: 500 }
    );
  }
}
