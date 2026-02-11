import { NextRequest, NextResponse } from "next/server";
import { getTopics } from "@/lib/db";

export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get("section");
  if (!section || !["countries", "outdoors", "guides"].includes(section)) {
    return NextResponse.json(
      { error: "Invalid or missing section" },
      { status: 400 }
    );
  }
  try {
    const topics = getTopics(section);
    return NextResponse.json(topics);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load topics" },
      { status: 500 }
    );
  }
}
