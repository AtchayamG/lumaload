import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { setCachedWorkingModel } from "@/lib/ai/gemini";

export const maxDuration = 30;

interface ModelTestResult {
  model: string;
  ok: boolean;
  errorName?: string;
  errorMessage?: string;
  status?: number;
  latencyMs: number;
}

  function callWithTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    return NextResponse.json(
      {
        model: "gemini-3.8-flash",
        ok: false,
        errorName: "ConfigurationError",
        errorMessage: "GEMINI_API_KEY environment variable is absent or empty",
        status: 500,
        latencyMs: 0,
      },
      { status: 200 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Test primary target model first
  const primaryModel = "gemini-3.8-flash";
  const start = Date.now();
  let primaryResult: ModelTestResult = {
    model: primaryModel,
    ok: false,
    latencyMs: 0,
  };

  try {
    const res = await callWithTimeout(
      ai.models.generateContent({
        model: primaryModel,
        contents: 'Reply with the JSON {"ok":true}',
      }),
      8000
    );
    primaryResult = {
      model: primaryModel,
      ok: true,
      latencyMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string; status?: number; code?: number };
    primaryResult = {
      model: primaryModel,
      ok: false,
      errorName: e.name || "Error",
      errorMessage: e.message || "Unknown error",
      status: e.status || e.code || 500,
      latencyMs: Date.now() - start,
    };
  }

  // If primary model failed, test the cascade models
  const cascadeCandidates = [
    "gemini-2.5-flash",
  ];

  const cascadeResults: ModelTestResult[] = [];
  let workingModel: string | null = primaryResult.ok ? primaryModel : null;

  if (!primaryResult.ok) {
    for (const model of cascadeCandidates) {
      const cStart = Date.now();
      try {
        await callWithTimeout(
          ai.models.generateContent({
            model,
            contents: 'Reply with the JSON {"ok":true}',
          }),
          8000
        );
        const cLatency = Date.now() - cStart;
        cascadeResults.push({
          model,
          ok: true,
          latencyMs: cLatency,
        });
        if (!workingModel) {
          workingModel = model;
        }
      } catch (err: unknown) {
        const e = err as { name?: string; message?: string; status?: number; code?: number };
        cascadeResults.push({
          model,
          ok: false,
          errorName: e.name || "Error",
          errorMessage: e.message || "Unknown error",
          status: e.status || e.code || 500,
          latencyMs: Date.now() - cStart,
        });
      }
    }
  }

  if (workingModel) {
    setCachedWorkingModel(workingModel);
  }

  return NextResponse.json(
    {
      model: primaryResult.model,
      ok: primaryResult.ok,
      errorName: primaryResult.errorName,
      errorMessage: primaryResult.errorMessage,
      status: primaryResult.status,
      latencyMs: primaryResult.latencyMs,
      workingModel,
      cascade: cascadeResults,
    },
    { status: 200 }
  );
}
