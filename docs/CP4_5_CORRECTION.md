# CP4.5 — CORRECTION ORDER (blocking, before CP5)

Good work on CP3.5 — hero copy fixed, header wraps, viewport sweep clean at all four widths, latency down from 49.5s to 6.8s, all five routes return 200, ribbon now 6 paths with a capacity floor. Verified live.

The `/api/diag` output you returned identifies the real problem, and it is **architectural, not a bug**.

---

## P0-1 — The free tier gives 20 requests per day, and the quota does not reset before the deadline

Your diag output:

```
quotaId:      "GenerateRequestsPerDayPerProjectPerModel-FreeTier"
quotaMetric:  "generativelanguage.googleapis.com/generate_content_free_tier_requests"
quotaValue:   "20"
status:       RESOURCE_EXHAUSTED (429)
```

Twenty requests **per day, per project, per model** — and `gemini-2.5-flash` returned the identical limit, so the cascade does not rescue us. Google resets RPD at midnight Pacific, which is **12:30 IST on 5 Sep**. The Devpost deadline is **09:15 IST on 5 Sep** — the reset lands **3h15m after we have already submitted**.

So: the model cannot be relied on for the demo video, for final verification, or for judges opening the site during the 5–11 Sep judging window. At 3 model calls per analysis, 20 requests is **6 analyses per day, shared across you, me, and every judge**.

Do all four of the following.

**(a) Cut model calls per analysis from 3 to a maximum of 2.**
- `verify_plan`: one batched call returning an array of verdicts, never one call per recommendation. (You may already have done this — confirm.)
- `structure_activities`: run the deterministic priors first. Only call the model for events whose category is `other` or whose label doesn't map to a known prior. For all three demo fixtures this should be **zero** model calls, because every event maps to a prior.
- Net: a demo-day analysis costs **1** model call (compose_plan), a custom day costs at most 2.

**(b) Add the lite models to the end of the cascade.** They carry separate, higher free-tier RPD:
```
gemini-3.8-flash → gemini-3.5-flash → gemini-2.5-flash
                 → gemini-3.5-flash-lite → gemini-2.5-flash-lite
```
Cascade on 429/RESOURCE_EXHAUSTED as well as on error. Record the model that actually served in `modelUsed`.

**(c) Never let a 429 cost the user 8 seconds.** A quota error returns in ~150ms. Detect `status === 429` and fall through to the next model **immediately** — no timeout wait, no retry-delay honouring. Total pipeline must stay under 8s even when every model is exhausted.

**(d) Surface quota state honestly in the UI.** When every model 429s, the Glass Box must say, in plain words:

> Model quota exhausted on the free tier. This plan was produced by LumaLoad's deterministic rules engine. The evidence, safety gates and boundaries below are unaffected — they never depend on a model.

Never imply a model ran when it did not. This honesty is a Responsible AI asset, not an embarrassment.

---

## P0-2 — Pre-compute the three demo days with real Gemini output. This is the highest-value task remaining.

Judges will overwhelmingly click **"Try Maya's day"**. That path must show genuine model output, instantly, forever, regardless of quota.

Build it:

1. `scripts/precompute-demos.ts` — a local Node script that runs the **full real pipeline** against each of the three fixtures (Maya Day 5, A Quieter Tuesday, Safety Stop Demo) using a live Gemini call, and writes to `src/data/precomputed/<fixtureId>.json`:
   ```json
   {
     "fixtureId": "maya-day-5",
     "computedAt": "2026-09-04T18:20:00+05:30",
     "modelUsed": "gemini-3.8-flash",
     "response": { ...the complete AnalysisResponse, real trace and real durations... }
   }
   ```
2. `/api/analyze-day` computes a stable hash of the incoming `{symptoms, context, events}`. On an exact match with a fixture hash, return the pre-computed response immediately, with one extra trace stage prepended:
   ```
   served_from_precomputed | ok | cache | 2ms
   detail: "Demo day analysed with gemini-3.8-flash on 4 Sep 2026. Re-run live to call the model now."
   ```
3. On the Plan and Glass Box screens, show a small honest label next to the model disclosure: **"Pre-computed with gemini-3.8-flash · 4 Sep 2026"**, plus a **"Re-run live"** button that forces a fresh model call so a judge can prove it works.
4. Any day the user edits or builds themselves goes live, exactly as now.

Run the script the moment quota allows — you have **20 requests today across the whole project, so spend them deliberately**: no more benchmark loops, no more exploratory model calls. Every remaining request goes to pre-computation. If quota is already exhausted, write the script and the serving path now, and run it the moment Atchayam enables billing (see the note I've sent him separately).

Commit the pre-computed JSON to the repo. It is a build artefact, not a fake — it is real model output with a real timestamp, clearly labelled.

---

## P0-3 — The Load Ribbon still reads as a stacked area chart

Corners are rounded now, but the three colours are still stacked into one contiguous mass with flat plateau tops. It still reads as a chart, not as the signature visual. Restating the requirement precisely:

- **Unstack.** Each strand gets its **own centreline** at a fixed vertical position (cognitive upper third, sensory middle, physical lower third). Each strand's thickness varies with its own demand, expanding symmetrically about its own centreline. They may overlap where demand is high — render overlaps with partial opacity or a multiply blend so the crossing is visible. A stack makes the three axes impossible to read separately, which contradicts the product's entire thesis.
- **No plateaus.** Resample to 5-minute resolution and pass through a Catmull-Rom spline so a 90-minute block swells and tapers rather than forming a flat-topped slab with rounded corners.
- **The floor must be broken through.** Draw the Capacity Baseline as a filled region rising from the bottom. Where combined demand exceeds it, the strands must visibly cross into it, and the hatch marks that intersection. A reader should understand the pressure point without reading its label.
- Minimum 6px rendered thickness per strand so the physical axis stays visible at low values.
- Greyscale test: screenshot it, desaturate it, and confirm all three strands are still distinguishable by position and thickness alone.

---

## P1 — Cold-visit states for /plan and /trace

`/plan` and `/trace` return 200 but only ~9.5KB against `/canvas` at 69KB — they are near-empty when visited directly without session state. A judge who opens a bare URL, or returns after a refresh, must not see a blank page. Give each a real empty state: one line explaining what the screen shows, and a button back to the canvas or to load Maya's day.

---

## Report back

1. Model calls per analysis for a demo day, and for a custom day.
2. Whether `scripts/precompute-demos.ts` ran, and for which fixtures.
3. A screenshot or description confirming the three strands are unstacked and independently readable.
4. Remaining Gemini requests used today, so we can budget the rest.

Then continue CP5. Clock: **15h 30m to deadline. Feature freeze 02:30 IST.**
