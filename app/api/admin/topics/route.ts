import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth-server";
import {
  addTopic,
  updateTopic,
  generateId,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const section = body.section;
    if (!section || !["countries", "outdoors", "guides"].includes(section)) {
      return NextResponse.json(
        { error: "Invalid or missing section" },
        { status: 400 }
      );
    }
    const id = body.id ?? generateId();
    const title = body.title ?? "";
    const photo = body.photo ?? body.image ?? "";
    const preview = body.preview ?? "";
    const content = body.content ?? "";
    addTopic({ id, section, title, photo, preview, content });
    return NextResponse.json({ id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to add topic" },
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
    const { section, id, title, photo, image, preview, content } = body;
    if (!section || !id) {
      return NextResponse.json(
        { error: "Missing section or id" },
        { status: 400 }
      );
    }
    updateTopic(section, id, {
      title,
      photo: photo ?? image ?? "",
      preview,
      content,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const section = request.nextUrl.searchParams.get("section");
    const id = request.nextUrl.searchParams.get("id");
    if (!section || !id) {
      return NextResponse.json(
        { error: "Missing section or id" },
        { status: 400 }
      );
    }
    const { deleteTopic } = await import("@/lib/db");
    deleteTopic(section, id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
