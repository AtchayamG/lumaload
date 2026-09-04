import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0
  );

  return NextResponse.json(
    {
      status: "ok",
      model: hasKey ? "configured" : "absent",
      version: "0.1.0",
      commit: process.env.VERCEL_GIT_COMMIT_SHA || "local-build",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
