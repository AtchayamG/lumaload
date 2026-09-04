# LumaLoad — 3-Minute Video Recording Script

**Target Duration:** Exactly 3 minutes (0:00 – 3:00)  
**Speaker:** Atchayam G (Solo Builder)  
**Production Setup:** Browser open to `https://lumaload.vercel.app` (Full screen, 1080p, Light mode default). Clean desktop, microphone calibrated.  
**Plan B Fallback Note:** Precomputed demo days load in 333ms. If live Gemini API latency spikes during recording, the script includes exact Plan B timestamps to trigger the instant precomputed cache without pausing speech.

---

### Shot List & Screen Layout Quick Reference

| Shot # | Time Window | Screen / URL | Exact Screen Location | Purpose |
|---|---|---|---|---|
| **Shot 1** | 0:00 – 0:30 | **S1 Story** (`/`) | Hero header & Load Ribbon (`#hero-ribbon`) | Problem statement, thesis, 3 load strands |
| **Shot 2** | 0:30 – 1:00 | **S2 Check-In** (`/check-in`) | Top CDC Checklist (`#danger-signs-card`) & Sliders | Deterministic emergency hard-stop & symptom baseline |
| **Shot 3** | 1:00 – 1:45 | **S3 Canvas** (`/canvas`) | Event Editor Modal, 24h Timeline & Ribbon | Interactive editing, clinician boundary, pressure points |
| **Shot 4** | 1:45 – 2:20 | **S4 Plan** (`/plan`) | Recommendation Cards & Why? Drawers | Grounded accommodations, institutional evidence, Before/After |
| **Shot 5** | 2:20 – 2:45 | **S5 Trace** (`/trace`) | 7-Stage Glass Box Audit & Verifier Deletions | Explainability, PII scrub, model purge proof |
| **Shot 6** | 2:45 – 3:00 | **S3 Canvas** (`/canvas`) | Top Bar Low Stimulus Switch | Neurological accessibility, closing summary |

---

## Second-by-Second Video Recording Script

### Shot 1: The Invisible Demand & Load Cartography (0:00 – 0:30)
- **Screen Location:** `https://lumaload.vercel.app` (Screen S1 — Story). Cursor starts hovering near the LumaLoad brand header.
- **Exact Clicks:**
  - `[0:00]` Mouse rests on the hero title.
  - `[0:15]` Mouse traces the three flowing strands on the hero Load Ribbon (Teal, Amber, Sage).
  - `[0:27]` Click the primary CTA button: **"Map Your Day on Canvas →"** (or "Explore Maya's Recovery Day").
- **Exact Words to Speak:**
  > *"Every year, millions of people recover from concussions. But real recovery isn't just lying in a dark room, and it isn't a single score on a screen. Everyday life stacks cognitive, sensory, and physical demands on top of an already exhausted brain. A 90-minute lecture, a noisy cafeteria lunch, and an afternoon commute all drain different neurological reserves. Existing apps offer either passive symptom trackers or ungrounded AI chatbots that invent medical advice. This is LumaLoad: a recovery load operating system that maps hidden neurological demand and guides evidence-backed pacing."*

---

### Shot 2: Deterministic Safety & The Hard Stop Gate (0:30 – 1:00)
- **Screen Location:** `https://lumaload.vercel.app/check-in` (Screen S2 — Check-In).
- **Exact Clicks:**
  - `[0:32]` Mouse scrolls down to the red **"Step 1: Clinical Gate & CDC Danger Signs"** checklist.
  - `[0:38]` Click checkbox: *"A headache that gets worse and does not go away"*.
  - `[0:43]` The red emergency screen immediately takes over the viewport (`HALTED`).
  - `[0:48]` Click **"Review Checklist"** to return and uncheck the danger sign.
  - `[0:53]` Quickly drag the **Photophobia** slider to `6` and **Fatigue** slider to `7`. Click **"Save Check-In & Proceed to Canvas →"**.
- **Exact Words to Speak:**
  > *"Safety in LumaLoad is strictly deterministic—it is never delegated to an AI model. Before any schedule is planned, we evaluate 8 CDC red-flag danger signs. If any danger sign is present, the entire generative pipeline is instantly hard-stopped before a model is ever touched, immediately directing the patient to emergency medical care. Once clinical safety is cleared, our 8-symptom inventory captures calibrated sensitivities to light, noise, and cognitive exertion."*

---

### Shot 3: Recovery Canvas, Interactive Editor & Boundary Locks (1:00 – 1:45)
- **Screen Location:** `https://lumaload.vercel.app/canvas` (Screen S3 — Recovery Canvas).
- **Exact Clicks:**
  - `[1:02]` Point to the top Load Ribbon: show Cognitive (y=55, dashed), Sensory (y=110, dotted), and Physical (y=165, solid) strands flowing over the hatched purple Capacity Baseline.
  - `[1:12]` Click the **"+ Add Activity"** button on the timeline toolbar.
  - `[1:16]` In the EventEditor modal: type *"Quiet Reading"* in the Label, select *"Reading"* category, select tags *"screen"* and *"quiet"*, and click **"Save Activity"**.
  - `[1:25]` Point to the evening event: **"5-a-side Football"**. Show the locked red badge: *"Clinician Boundary: High Risk — Contact Sport"*.
  - `[1:33]` Click the primary CTA: **"Analyze My Day & Generate Plan →"**.
- **Exact Words to Speak:**
  > *"Here on the Recovery Load Canvas, a patient's day becomes visible cartography. Three independent strands—cognitive, sensory, and physical—resample demand continuously every 5 minutes. Notice the afternoon stack: a 90-minute screen session and noisy lunch surge past Maya's capacity floor, triggering two high-severity pressure points. Patients can freely add, edit, or reschedule activities. Notice her evening football match: LumaLoad deterministically locks it under a Clinician Boundary. High-risk contact sports can never be rescheduled or cleared by generative AI."*
- **Plan B Fallback Note (`[1:35]`):**
  - *Normal execution:* The live analysis completes in ~3.2 seconds.
  - *Plan B (Latency or Quota Spike):* If loading indicator runs past 3 seconds, click the profile switcher button **"Maya (Day 5)"** at the top right of the canvas. The instant precomputed cache returns in **333ms** without interruption.

---

### Shot 4: The Luma Plan & Radical Evidence Grounding (1:45 – 2:20)
- **Screen Location:** `https://lumaload.vercel.app/plan` (Screen S4 — Luma Plan).
- **Exact Clicks:**
  - `[1:48]` Scroll to the top recommendations list.
  - `[1:54]` Click the **"Why? (Evidence & Guideline)"** drawer on the first recommendation: *"Split 90-minute study session into 25-minute Pomodoros"*.
  - `[2:02]` Hover over the evidence citation chip: `cdc-heads-up-cognitive-rest`. Point out the direct external link to the CDC concussion portal.
  - `[2:10]` Scroll down to the **"Before & After Recovery Cartography"** comparison ribbon.
- **Exact Words to Speak:**
  > *"The resulting Luma Plan synthesizes actionable, realistic accommodations for low-risk daily activities. But unlike conversational AI, every single recommendation is grounded in an institutional evidence registry. Expanding the 'Why?' drawer reveals the exact clinical guideline cited—in this case, CDC HEADS UP cognitive pacing—with direct verified links. Notice our transparency cards: we explicitly declare what LumaLoad inferred and what it does not know. Below, the Before and After ribbon demonstrates how distributed rest breaks pull demand back under the capacity baseline."*

---

### Shot 5: The Glass Box — Complete Algorithmic Audit (2:20 – 2:45)
- **Screen Location:** `https://lumaload.vercel.app/trace` (Screen S5 — The Glass Box).
- **Exact Clicks:**
  - `[2:21]` Click **"Inspect Glass Box Audit"** in the navigation bar.
  - `[2:25]` Scroll down through the 7-stage execution timeline (`sanitize` -> `safety_check` -> `structure_activities` -> `retrieve_evidence` -> `compose_plan` -> `verify_plan` -> `build_trace`).
  - `[2:33]` Click into the **"Active Verifier Claims Purged"** accordion and the **"Sanitized Payload Inspector"**.
- **Exact Words to Speak:**
  > *"We believe healthcare AI requires radical transparency. Screen S5 is The Glass Box: a complete execution audit of our 7-stage pipeline. Every stage records exact millisecond durations and model delegation. In Stage 1, all personal identifiers are deterministically scrubbed before any external API is touched. In Stage 6, our 7-gate verifier actively validates every model output against our static registry, purging any hallucinated citation, unsupported claim, or banned clinical language before it can ever reach the patient."*

---

### Shot 6: Neurological Accessibility & Closing (2:45 – 3:00)
- **Screen Location:** Top navigation bar of any page (or `/canvas`).
- **Exact Clicks:**
  - `[2:47]` Click the **"Low Stimulus"** switch in the top navigation bar.
  - `[2:50]` Point to the screen as contrast softens, ambient animations stop completely, and ribbons transition into calm, high-contrast accessible bands.
  - `[2:57]` Mouse rests on the wordmark: *LumaLoad — Plan the day. Protect the recovery.*
- **Exact Words to Speak:**
  > *"Because concussion patients often suffer from severe photophobia and cognitive fatigue, LumaLoad is built from the ground up for accessibility: 100 out of 100 Lighthouse accessibility on every screen, complete keyboard traversal, 44px targets, and an instant Low Stimulus Mode that strips all motion and calms visual noise. LumaLoad: Plan the day. Protect the recovery. Thank you."*

---

## Recording Tips for Flawless 1-Take Video
1. **Resolution:** Set display to 1920x1080 at 100% DPI scaling in Windows display settings.
2. **Browser:** Use Chrome or Edge in a clean Incognito/Guest profile with bookmarks bar hidden (`Ctrl+Shift+B`).
3. **Pacing:** Keep spoken cadence calm and deliberate. Do not rush; the script is timed at ~130 words per minute.
4. **Mouse Movement:** Move the cursor smoothly without erratic shaking. Let clicks register visually.
