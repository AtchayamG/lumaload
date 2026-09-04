import fs from "fs";
import path from "path";
import demoDays from "../src/data/demo-days.json";
import { runAnalysisPipeline } from "../src/lib/pipeline/orchestrator";
import { DeterministicProvider } from "../src/lib/ai/deterministic";
import { GeminiProvider } from "../src/lib/ai/gemini";
import { DaySubmission, DayEventSchema } from "../src/lib/contracts/day";

// Safely load .env.local if not already present in environment
if (!process.env.GEMINI_API_KEY) {
  const envLocalPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const idx = trimmed.indexOf("=");
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
          if (key === "GEMINI_API_KEY") {
            process.env.GEMINI_API_KEY = val;
          }
        }
      }
    }
  }
}

async function main() {
  const outDir = path.join(process.cwd(), "src/data/precomputed");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const nowIso = new Date().toISOString();

  let provider: GeminiProvider | DeterministicProvider;
  try {
    provider = new GeminiProvider();
  } catch (err) {
    console.warn("Failed to initialize GeminiProvider, using DeterministicProvider:", (err as Error).message);
    provider = new DeterministicProvider();
  }

  for (const persona of demoDays.personas) {
    console.log(`\n==================================================`);
    console.log(`Pre-computing fixture: ${persona.id} (${persona.name})`);
    console.log(`==================================================`);

    const submission: DaySubmission = {
      symptoms: persona.symptoms,
      context: {
        daysSinceInjury: persona.context.daysSinceInjury,
        setting: persona.context.setting as any,
        clinicianSeen: persona.context.clinicianSeen,
        feelingUnableToCope: persona.context.feelingUnableToCope ?? false,
      },
      dangerSignsSelected: persona.dangerSigns || [],
      events: persona.events.map((e) => DayEventSchema.parse(e)),
    };

    const response = await runAnalysisPipeline(submission, provider);

    console.log(`Status: ${response.status}`);
    console.log(`Model Used: ${response.modelUsed}`);
    
    const structStage = response.trace.find((t) => t.name === "structure_activities");
    const composeStage = response.trace.find((t) => t.name === "compose_plan");
    
    if (structStage) {
      console.log(`structure_activities: kind=${structStage.kind}, status=${structStage.status}, duration=${structStage.durationMs}ms`);
      console.log(`  detail: "${structStage.detail}"`);
    }
    if (composeStage) {
      console.log(`compose_plan: kind=${composeStage.kind}, status=${composeStage.status}, duration=${composeStage.durationMs}ms`);
      console.log(`  detail: "${composeStage.detail}"`);
    }

    const artifact = {
      fixtureId: persona.id,
      computedAt: nowIso,
      modelUsed: response.modelUsed,
      response,
    };

    const targetFile = path.join(outDir, `${persona.id}.json`);
    fs.writeFileSync(targetFile, JSON.stringify(artifact, null, 2), "utf-8");
    console.log(`Saved honest artifact to: ${targetFile}`);
  }

  console.log("\nAll demo day fixtures pre-computed successfully.");
}

main().catch(console.error);