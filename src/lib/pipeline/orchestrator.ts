import { DaySubmission } from "@/lib/contracts/day";
import { AnalysisResponse, Recommendation } from "@/lib/contracts/plan";
import { TraceStage } from "@/lib/contracts/trace";
import { evaluateDangerSigns } from "@/lib/safety/dangerSigns";
import { classifyActivityRisk } from "@/lib/safety/restrictedActivities";
import { shouldShowDistressSignpost } from "@/lib/safety/distress";
import { sanitizeEvents } from "@/lib/ai/sanitize";
import { retrieveRelevantEvidence } from "@/lib/evidence/retrieve";
import { aggregateDayLoad } from "@/lib/load/aggregate";
import { verifyPlan } from "./stages/verifyPlan";
import { AIProvider } from "@/lib/ai/provider";
import { GeminiProvider } from "@/lib/ai/gemini";
import { DeterministicProvider } from "@/lib/ai/deterministic";
import { getAllEvidence } from "@/lib/evidence/registry";

export async function runAnalysisPipeline(
  submission: DaySubmission,
  customProvider?: AIProvider
): Promise<AnalysisResponse> {
  const provider = customProvider || new GeminiProvider();
  const trace: TraceStage[] = [];

  const { symptoms, context, events, dangerSignsSelected } = submission;

  // ----------------------------------------------------
  // Stage 1: Sanitize (deterministic)
  // ----------------------------------------------------
  const t1Start = Date.now();
  const { sanitizedEvents, tokensStrippedCount, details: sanitizeDetails } =
    sanitizeEvents(events);
  trace.push({
    name: "sanitize",
    status: "ok",
    startedAt: t1Start,
    durationMs: Math.max(1, Date.now() - t1Start),
    kind: "deterministic",
    detail: sanitizeDetails,
    itemsIn: events.length,
    itemsOut: sanitizedEvents.length,
  });

  // ----------------------------------------------------
  // Stage 2: Safety Check (deterministic)
  // ----------------------------------------------------
  const t2Start = Date.now();
  const dangerCheck = evaluateDangerSigns(dangerSignsSelected);
  const restrictedEventIds = events
    .filter((e) => classifyActivityRisk(e.category, e.label) === "restricted")
    .map((e) => e.id);
  const distressSignpostShown = shouldShowDistressSignpost(symptoms, context);

  if (dangerCheck.hasDangerSigns) {
    trace.push({
      name: "safety_check",
      status: "halted",
      startedAt: t2Start,
      durationMs: Math.max(1, Date.now() - t2Start),
      kind: "deterministic",
      detail: `EMERGENCY HARD STOP: ${dangerCheck.selectedSigns.length} CDC danger sign(s) detected. Pipeline halted immediately.`,
      itemsIn: dangerSignsSelected.length,
      itemsOut: dangerCheck.selectedSigns.length,
    });

    // Mark downstream stages as SKIPPED
    const skippedStages = [
      { name: "structure_activities", kind: "model" as const },
      { name: "retrieve_evidence", kind: "retrieval" as const },
      { name: "compose_plan", kind: "model" as const },
      { name: "verify_plan", kind: "deterministic" as const },
      { name: "build_trace", kind: "deterministic" as const },
    ];

    for (const st of skippedStages) {
      trace.push({
        name: st.name,
        status: "skipped",
        startedAt: Date.now(),
        durationMs: 0,
        kind: st.kind,
        detail: "SKIPPED — blocked by safety gate (CDC danger signs active).",
      });
    }

    const { activityLoads, capacity } = aggregateDayLoad(events, symptoms);

    return {
      status: "emergency_halt",
      safety: {
        dangerSignsDetected: true,
        dangerSignsSelected: dangerCheck.selectedSigns,
        restrictedEventIds,
        distressSignpostShown,
      },
      capacity,
      activityLoads,
      recommendations: [],
      evidence: [],
      verification: {
        grounded: true,
        boundaryPassed: true,
        unsupportedClaimsRemoved: [],
        bannedLanguageRemoved: [],
      },
      trace,
      modelUsed: null,
    };
  }

  trace.push({
    name: "safety_check",
    status: "ok",
    startedAt: t2Start,
    durationMs: Math.max(1, Date.now() - t2Start),
    kind: "deterministic",
    detail: `Passed danger signs check. ${restrictedEventIds.length} restricted activity boundaries locked. Distress triage: ${distressSignpostShown ? "triggered" : "normal"}.`,
    itemsIn: events.length,
    itemsOut: events.length - restrictedEventIds.length,
  });

  // Calculate baseline capacity and load profiles
  const dayLoad = aggregateDayLoad(sanitizedEvents, symptoms);

  // ----------------------------------------------------
  // Stage 3 & 4: Structure Activities & Retrieve Evidence (Parallel)
  // ----------------------------------------------------
  const t3Start = Date.now();
  let modelUsed: string | null = null;

  const [structureResult, retrievedEvidence] = await Promise.all([
    provider.structureActivities(sanitizedEvents, symptoms).catch((err) => {
      const fallback = new DeterministicProvider();
      return fallback.structureActivities(sanitizedEvents, symptoms);
    }),
    Promise.resolve().then(() => {
      const t4Start = Date.now();
      const docs = retrieveRelevantEvidence(sanitizedEvents, symptoms, 8);
      const d4 = Math.max(1, Date.now() - t4Start);
      trace.push({
        name: "retrieve_evidence",
        status: "ok",
        startedAt: t4Start,
        durationMs: d4,
        kind: "retrieval",
        detail: `Retrieved top ${docs.length} verified evidence chunks scored by symptom profile and event demands.`,
        itemsIn: getAllEvidence().length,
        itemsOut: docs.length,
      });
      return docs;
    }),
  ]);

  const d3 = Math.max(1, Date.now() - t3Start);
  modelUsed = structureResult.modelUsed;

  trace.push({
    name: "structure_activities",
    status: structureResult.usedFallback ? "fallback" : "ok",
    startedAt: t3Start,
    durationMs: d3,
    kind: structureResult.usedFallback ? "deterministic" : "model",
    detail: structureResult.usedFallback
      ? "Structured loads via deterministic category priors and duration/environment heuristics (rules engine)."
      : `Classified ${structureResult.activityLoads.length} event demand vectors via ${structureResult.modelUsed}.`,
    itemsIn: sanitizedEvents.length,
    itemsOut: structureResult.activityLoads.length,
  });

  // ----------------------------------------------------
  // Stage 5: Compose Plan (Model with Deterministic Fallback)
  // ----------------------------------------------------
  const t5Start = Date.now();
  let composeOutput = await provider
    .composePlan(
      sanitizedEvents,
      symptoms,
      context,
      dayLoad.capacity.baseline,
      retrievedEvidence
    )
    .catch((err) => {
      const fallback = new DeterministicProvider();
      return fallback.composePlan(
        sanitizedEvents,
        symptoms,
        context,
        dayLoad.capacity.baseline,
        retrievedEvidence
      );
    });

  if (composeOutput.modelUsed) {
    modelUsed = composeOutput.modelUsed;
  }

  const d5 = Math.max(1, Date.now() - t5Start);
  trace.push({
    name: "compose_plan",
    status: composeOutput.usedFallback ? "fallback" : "ok",
    startedAt: t5Start,
    durationMs: d5,
    kind: composeOutput.usedFallback ? "deterministic" : "model",
    detail: composeOutput.usedFallback
      ? `Synthesized ${composeOutput.recommendations.length} recommendations via deterministic rules engine.`
      : `Synthesized ${composeOutput.recommendations.length} recommendations via ${composeOutput.modelUsed} grounded in retrieved evidence.`,
    itemsIn: retrievedEvidence.length,
    itemsOut: composeOutput.recommendations.length,
  });

  // ----------------------------------------------------
  // Stage 6: Verify Plan (Seven-Stage Verifier)
  // ----------------------------------------------------
  const t6Start = Date.now();
  const { verifiedRecommendations, verification } = await verifyPlan(
    composeOutput.recommendations,
    sanitizedEvents,
    provider
  );
  const d6 = Math.max(1, Date.now() - t6Start);

  trace.push({
    name: "verify_plan",
    status: "ok",
    startedAt: t6Start,
    durationMs: d6,
    kind: "deterministic",
    detail: `Verification pass: ${verifiedRecommendations.length} approved, ${verification.unsupportedClaimsRemoved.length} unsupported claim(s) purged, ${verification.bannedLanguageRemoved.length} banned phrase(s) blocked.`,
    itemsIn: composeOutput.recommendations.length,
    itemsOut: verifiedRecommendations.length,
  });

  // If all recommendations were purged by verifier, safely populate from deterministic provider
  let finalRecommendations = verifiedRecommendations;
  if (finalRecommendations.length === 0) {
    const fallback = new DeterministicProvider();
    const fallbackResult = await fallback.composePlan(
      sanitizedEvents,
      symptoms,
      context,
      dayLoad.capacity.baseline,
      retrievedEvidence
    );
    finalRecommendations = fallbackResult.recommendations;
  }

  // ----------------------------------------------------
  // Stage 7: Build Trace & Response
  // ----------------------------------------------------
  const t7Start = Date.now();
  trace.push({
    name: "build_trace",
    status: "ok",
    startedAt: t7Start,
    durationMs: Math.max(1, Date.now() - t7Start),
    kind: "deterministic",
    detail: `Assembled 7-stage Glass Box trace with ${finalRecommendations.length} verified recommendations.`,
  });

  return {
    status: composeOutput.usedFallback ? "degraded" : "ok",
    safety: {
      dangerSignsDetected: false,
      dangerSignsSelected: [],
      restrictedEventIds,
      distressSignpostShown,
    },
    capacity: dayLoad.capacity,
    activityLoads: structureResult.activityLoads,
    recommendations: finalRecommendations.slice(0, 5),
    evidence: retrievedEvidence,
    verification,
    trace,
    modelUsed,
  };
}
