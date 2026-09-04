import { NextRequest, NextResponse } from "next/server";
import { DaySubmissionSchema } from "@/lib/contracts/day";
import { runAnalysisPipeline } from "@/lib/pipeline/orchestrator";
import { findMatchingPrecomputed } from "@/lib/pipeline/precomputed";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = DaySubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid submission payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const forceLive = body.forceLive === true;
    const precomputed = findMatchingPrecomputed(parseResult.data, forceLive);

    if (precomputed) {
      return NextResponse.json(precomputed, { status: 200 });
    }

    const analysis = await runAnalysisPipeline(parseResult.data);
    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("Analysis pipeline error:", (error as Error).message);
    return NextResponse.json(
      {
        error: "Failed to execute recovery analysis pipeline",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
