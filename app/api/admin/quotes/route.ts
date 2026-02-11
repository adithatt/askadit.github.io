import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth-server";
import {
  addQuote,
  updateQuote,
  deleteQuote,
  generateId,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = body.id ?? generateId();
    const quote_text =
      body.quote_text ?? body.quote ?? "";
    const author = body.author ?? body.attribution ?? "";
    const reflection = body.reflection ?? "";
    addQuote({ id, quote_text, author, reflection });
    return NextResponse.json({ id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to add quote" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, quote_text, quote, author, attribution, reflection } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    updateQuote(id, {
      quote_text: quote_text ?? quote,
      author: author ?? attribution,
      reflection,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    deleteQuote(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 }
    );
  }
}
