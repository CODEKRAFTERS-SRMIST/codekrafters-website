import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("event_postings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }

    return NextResponse.json({ events: data });
  } catch (error) {
    console.error("GET Events Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // For simplicity, we expect JSON with category, title, description, and image_url
    // In a real scenario with direct upload here, we'd parse FormData. 
    // It's often easier to upload to Supabase Storage directly from the frontend using supabase-js
    // and then call this API with the resulting image_url.
    const body = await request.json();
    const { category, title, description, image_url } = body;

    if (!category || !title || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("event_postings")
      .insert([
        { category, title, description, image_url }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting event:", error);
      return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (error) {
    console.error("POST Event Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, category, title, description, image_url } = body;

    if (!id || !category || !title || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("event_postings")
      .update({ category, title, description, image_url })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (error) {
    console.error("PUT Event Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("event_postings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting event:", error);
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Event Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
