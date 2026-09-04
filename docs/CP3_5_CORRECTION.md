# CP3.5 — CORRECTION ORDER (blocking; do this before continuing CP4)

Independent review of the live deployment at 16:40 IST found **four blocking defects**. Your CP3 report claimed "Verified live execution of 7-stage pipeline with Gemini 3.8 Flash structured output, active verifier purging of unsupported claims." That is not what production does. Fix these, then resume CP4.

Do not mark a checkpoint green again until you have verified the claim against the **deployed URL**, not against local tests.

---

## P0-1 — Gemini never runs in production. Every model stage falls back.

A live POST to `/api/analyze-day` returned:

```
status:      "degraded"
modelUsed:   null
trace:
  sanitize            | ok       | deterministic |     1ms
  safety_check        | ok       | deterministic |     1ms
  retrieve_evidence   | ok       | retrieval     |     1ms
  structure_activities| fallback | deterministic | 20000ms   <- hit the 20s timeout
  compose_plan        | fallback | deterministic | 13042ms   <- real error, not a timeout
  verify_plan         | ok       | deterministic | 16001ms   <- two 8s verifier timeouts
  build_trace         | ok       | deterministic |     1ms
```

`/api/health` reports `model:"configured"`, so the env var is present. The model id `gemini-3.8-flash` is correct and current. Something else is failing, and **you cannot see what**, because of two bugs in `src/lib/ai/gemini.ts`:

1. Every `catch` block records only `(err as Error).name` — which for a fetch failure is just `"Error"`. The actual message and HTTP status are discarded.
2. `safeLog()` is wrapped in `if (process.env.NODE_ENV !== "production")`, so on Vercel it logs **nothing at all**.

Fix, in this order:

**(a) Make the failure visible.** Remove the `NODE_ENV` guard from `safeLog`. Keep the privacy rule — still never log symptoms, event labels, prompts or responses — but DO log `err.name`, `err.message`, and any `err.status` / `err.code`. Add the same string to the `detail` field of the trace stage so it surfaces in the API response.

**(b) Add `GET /api/diag`.** One trivial Gemini call (`contents: "Reply with the JSON {\"ok\":true}"`), no user data, returns:
```json
{ "model": "gemini-3.8-flash", "ok": false, "errorName": "...", "errorMessage": "...", "status": 403, "latencyMs": 812 }
```
Never return the key or any part of it. Deploy this and report the exact output back to me verbatim — that single line tells us whether this is an invalid key, a disabled API, a quota block, or a model not available on the free tier.

**(c) Add a model cascade.** The key is on a free-tier "Default Gemini Project". The newest model may not be enabled on it. Try in order and use the first that succeeds, recording which one in `modelUsed`:
```
gemini-3.8-flash  →  gemini-3.5-flash  →  gemini-2.5-flash
```
Cache the working model id in module scope for the life of the lambda so you pay the discovery cost once.

**(d) Keep the honest fallback.** `status:"degraded"` and `modelUsed:null` when the model fails is *correct* and it is part of the Responsible AI story — do not paper over it. Just make sure it isn't the only thing that ever happens.

---

## P0-2 — 49.5 seconds end to end. Unshippable.

Measured wall time on a live request: **49,570ms**, against a 60s `maxDuration` ceiling. A judge will assume it crashed. Bring the worst case under **20 seconds**:

- Drop `TIMEOUT_MS` from 20000 to **8000**, and the verifier timeout from 8000 to **5000**.
- The verifier currently calls the model **once per recommendation, sequentially** (16001ms ≈ 2 × 8000). Run them with `Promise.all`, or better, batch all recommendations into **one** verifier call that returns an array of verdicts.
- Confirm `structure_activities` and `retrieve_evidence` genuinely run under one `Promise.all`.
- Enforce a total pipeline budget: pass a deadline through the orchestrator and have any stage that would exceed it fall back immediately rather than start.
- On the client, show a real progress state naming the stage in flight ("Retrieving evidence…", "Composing plan…"). Never a bare spinner.

---

## P0-3 — Broken sentence in the hero. First thing a judge reads.

Live copy: *"Concussion recovery does not experience demand as one number."*

Concussion recovery is not a person and cannot experience anything. Replace with:

> A person recovering from a concussion doesn't experience demand as one number. LumaLoad maps the cognitive, sensory and physical load hidden inside an ordinary day, and measures each strand against the capacity your sleep and mood actually left you today.

Then read every other user-facing string aloud and fix anything else that parses wrong.

---

## P0-4 — Horizontal overflow at 390px.

`document.scrollWidth` = 392 against `clientWidth` = 390. Offenders:

| Element | Right edge |
|---|---|
| `button.low-stimulus-toggle` | 392 |
| its wrapper `div` | 392 |
| `footer.persistent-disclaimer-chrome` | 392 |

The header row (`LUMALOAD` + privacy pill + Low Stimulus toggle) does not wrap at narrow widths. Fix with `flex-wrap` and a mobile layout for the header; audit the footer's padding. Re-verify with `document.documentElement.scrollWidth === clientWidth` at 390, 768, 1024 and 1440.

Also: the **"Read as text"** button is 27px tall. Minimum touch target is 44px. Sweep every control for this.

---

## P1-1 — The Load Ribbon is a stacked area chart, not a ribbon.

This is the project's entire visual identity and the basis of the Best Design and Best Innovation claims. Right now it renders as three colours stacked into a single filled mass with hard vertical step edges at each event boundary. It reads as a generic chart.

Required changes:

- **Smooth it.** Resample demand onto a per-minute (or per-5-minute) series and draw with a Catmull-Rom or cubic spline. No vertical step edges. Strands should swell and taper.
- **Unstack it.** Three *independent* strands, each with its own centreline, each thickening and thinning with its own demand. They may overlap and interweave — that is the point. A stack makes the axes indistinguishable, which defeats the "not a single number" thesis.
- **Make the baseline mean something.** The Capacity Baseline currently renders as a flat rule floating *above* the strands, so nothing appears to press into anything and the pressure-point hatching looks unmotivated. Draw capacity as a filled floor and have the strands visibly break through it where a pressure point occurs. The reader should be able to see *why* the hatch is there without reading the label.
- The Physical strand is nearly invisible at Maya's values. Give every strand a minimum rendered thickness so all three axes stay legible.
- Keep the greyscale requirement: thickness plus hatch plus label must carry the meaning without colour.

---

## P1-2 — No README in the repo root.

The GitHub listing shows `docs/`, `public/`, `src/`, `tests/` and config files, but no `README.md`. A judge landing on the repo sees an unexplained file tree. Full README is CP6, but add a real one **now**: what LumaLoad is, the live URL, the safety model in three bullets, the six evidence sources with attribution, and the "not a medical device" statement. Expand it at CP6.

---

## What was verified good

- Repo is public, MIT licensed, real commit history.
- `/api/health` live and correct.
- `src/data/evidence.json` untouched, and citations resolve — the returned recommendation cited `cdc-recovery-003`, a real id.
- The deterministic safety engine works on the live endpoint: `restrictedEventIds:["e3"]` correctly flagged the contact-sport block, and `boundaryPassed:true`.
- Capacity baseline computed at 0.74 for Maya, matching the formula.
- Landing page renders cleanly at 1440px and the pressure-point hatching is well drawn.

---

## Reporting

Report back with, in this order:

1. The verbatim output of `GET /api/diag`.
2. A fresh live `POST /api/analyze-day` trace showing `modelUsed` non-null and total wall time.
3. `scrollWidth === clientWidth` at 390 / 768 / 1024 / 1440.
4. Then continue CP4.

Clock: **16h 30m to the Devpost deadline. Feature freeze 02:30 IST.**
