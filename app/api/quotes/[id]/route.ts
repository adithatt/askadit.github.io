import { NextRequest, NextResponse } from "next/server";
import { getQuote } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const quote = getQuote(id);
    if (!quote) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(quote);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load quote" },
      { status: 500 }
    );
  }
}
