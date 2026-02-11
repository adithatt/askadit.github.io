import { NextResponse } from "next/server";
import { getQuotes } from "@/lib/db";

export async function GET() {
  try {
    const quotes = getQuotes();
    return NextResponse.json(quotes);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load quotes" },
      { status: 500 }
    );
  }
}
