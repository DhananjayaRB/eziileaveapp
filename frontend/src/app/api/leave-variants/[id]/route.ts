import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    const response = await fetch(
      `https://qa-api.resolveindia.com/leave/api/leave-variant-details/${params.id}`,
      {
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch leave variant");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching leave variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch leave variant" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`https://qa-api.resolveindia.com/leave/api/leave-variant/${params.id}`);
    const body = await req.json();

    const authHeader = req.headers.get("Authorization");
    const response = await fetch(
      `https://qa-api.resolveindia.com/leave/api/leave-variant/${params.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to update leave variant");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating leave variant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update leave variant" },
      { status: 500 }
    );
  }
}
