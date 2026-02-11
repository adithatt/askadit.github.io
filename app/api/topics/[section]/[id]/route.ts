import { NextRequest, NextResponse } from "next/server";
import { getTopic } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params;
  if (!section || !id) {
    return NextResponse.json(
      { error: "Missing section or id" },
      { status: 400 }
    );
  }
  try {
    const topic = getTopic(section, id);
    if (!topic) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(topic);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load topic" },
      { status: 500 }
    );
  }
}
