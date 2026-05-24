import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("file");

  if (!filePath) {
    return new NextResponse("Missing file param", { status: 400 });
  }

  const { data, error } = await supabase.storage
    .from("quizzes")
    .download(filePath);

  if (error || !data) {
    return new NextResponse("File not found", { status: 404 });
  }

  const html = await data.text();

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}