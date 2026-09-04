# LumaLoad — Devpost Submission Packet

**Target Event:** Hack for Humanity | Summer 2026  
**Live URL:** [https://lumaload.vercel.app](https://lumaload.vercel.app)  
**GitHub Repository:** [https://github.com/AtchayamG/lumaload](https://github.com/AtchayamG/lumaload)  

---

## Elevator Pitch
LumaLoad maps the hidden cognitive, sensory and physical demand inside a concussion recovery day, using deterministic clinical safety guardrails and verified institutional evidence.

*(181 characters)*

---

## Inspiration
Recovering from a mild traumatic brain injury (concussion) is not a single number or a static checklist. Clinical consensus (such as the 6th International Consensus on Concussion in Sport, Amsterdam 2022) increasingly shows that prolonged total rest is harmful, yet unguided overexertion triggers severe symptom flare-ups. 

In everyday life, demand stacks silently: staring at a laptop, commuting on a crowded train, attending a noisy meeting, running an errand in bright sunlight, and attempting a workout all draw upon separate neurological reserves. Patients and caregivers are left guessing how to pace their days.

Existing digital health apps either offer passive symptom diaries with zero actionable guidance, or reckless conversational chatbots that hallucinate medical advice and invent clinical citations. We built LumaLoad to solve this: a specialized recovery load operating system that turns daily activities into a multi-strand neurological demand ribbon, enforces unbreakable deterministic clinical guardrails, and uses Gemini 3.8 Flash to synthesize grounded, evidence-backed pacing accommodations.

---

## What It Does
LumaLoad provides a comprehensive 5-screen clinical pacing workflow:

1. **Screen S1 · The Story (`/`):** Explains neurological load cartography with an organic, animated 3-strand Load Ribbon rendering real-world demand profiles, accompanied by immediate Low Stimulus Mode accessibility controls.
2. **Screen S2 · Safety Gate & Symptom Inventory (`/check-in`):**
   - **CDC Danger Signs Gate:** Evaluates 8 red-flag emergency symptoms (e.g., worsening headache, repeated vomiting, unequal pupils, seizures). If any are checked, the entire AI pipeline is instantly halted (`HALTED`), completely bypassing any model call and displaying calm, high-contrast emergency guidance.
   - **Calibrated Symptom Sliders:** Assesses 8 neurological symptoms (headache, dizziness, photophobia, phonophobia, fatigue, brain fog, nausea, mood changes) on a clinical 0–10 scale.
   - **Recovery Context:** Captures sleep quality, days post-injury, coping state, and clinical diagnosis status.
3. **Screen S3 · Recovery Load Canvas (`/canvas`):**
   - **24-Hour Interactive Timeline:** Complete timeline editor supporting adding, editing, and deleting daily events with start times, durations, and multi-select environmental tags (screen, crowded, loud, bright, travel, outdoors, quiet).
   - **Unstacked 3-Strand Load Ribbon:** Proprietary SVG cartography displaying 3 independent, continuously resampled Catmull-Rom demand strands: Cognitive (`y=55`, teal), Sensory (`y=110`, amber), and Physical (`y=165`, sage), with multiply blending and shaded Capacity Floor highlighting pressure points (>30 min above capacity).
   - **Clinician Boundary Locks:** High-risk activities (contact sports, driving) are deterministically locked with Clinician Boundary alerts that can never be cleared or rescheduled by generative AI.
   - **Synthetic Personas:** Immediate 1-click loading for Maya (Day 5 post-concussion student), A Quieter Tuesday (pacing contrast), and Emergency Stop Demo.
4. **Screen S4 · The Luma Plan (`/plan`):**
   - Synthesizes up to 5 prioritized, evidence-grounded accommodations (e.g., breaking 90-minute study blocks into 25-minute Pomodoros, swapping noisy cafeteria dining for outdoor quiet).
   - **Why? Drawers:** Every recommendation features an expandable justification citing verified institutional evidence IDs linking out to authoritative sources.
   - **Radical Transparency:** Dedicated cards explicitly disclosing *"What LumaLoad inferred"* vs *"What LumaLoad does not know"*.
   - **Before & After Ribbon Comparison:** Visualizes how proposed accommodations relieve demand peaks beneath the Capacity Baseline.
5. **Screen S5 · The Glass Box Execution Trace (`/trace`):**
   - Complete algorithmic visibility into the 7-stage pipeline with exact millisecond timings (`sanitize` -> `safety_check` -> `structure_activities` -> `retrieve_evidence` -> `compose_plan` -> `verify_plan` -> `build_trace`).
   - **Active Verifier Purges:** Documents any model hallucination, unverified citation, or banned clinical language stripped before reaching the user.
   - **Sanitized Payload Viewer:** Verifies that zero PII (names, emails, phone numbers) ever reached an external API.

---

## How We Built It
LumaLoad was built with an uncompromising focus on deterministic safety, zero-dependency precision, and strict privacy:

- **Frontend Architecture:** Next.js 15 (App Router) and React 19 in TypeScript strict mode. Built without bloated component libraries; all UI components, dialogs, sliders, and SVG cartography were written from scratch using pure CSS variables and design tokens (`src/styles/tokens.css`).
- **Cartography Engine:** Custom SVG Catmull-Rom spline algorithms (`src/components/ribbon/LoadRibbon.tsx`) that continuously resample 24-hour activity demand vectors every 5 minutes, rendering organic, unstacked strands with symmetrical width expansion, high-contrast greyscale underlays, and hatched breakthrough patterns.
- **AI Pipeline & Model Cascade:**
  - Integrated Google's `@google/genai` SDK with **Gemini 3.8 Flash** utilizing strict JSON schema enforcement (`responseMimeType: "application/json"`).
  - Robust multi-tier fallback cascade: `gemini-3.8-flash` -> `gemini-3.5-flash` -> `gemini-2.5-flash` -> `gemini-3.5-flash-lite` -> `gemini-2.5-flash-lite` -> deterministic rules engine.
  - Fail-safe quota management: 429 quota exhaustion is detected immediately (~150ms) and fails over gracefully to our offline rules engine, displaying an honest degraded mode banner.
  - Static precomputed demo payloads for instant sub-second cold loading (333ms) with full model provenance.
- **Deterministic Clinical Engine:**
  - Pure TypeScript safety layer (`src/lib/safety/`) evaluating CDC danger signs, clinical boundaries, and mental health distress triage independently of model inference.
  - Seven-gate claim verifier (`src/lib/verifier/`) ensuring 100% of recommendations link to our verified static evidence registry (`src/data/evidence.json`), stripping any hallucinations.
- **Zero-Storage Privacy Architecture:**
  - Client-side Zustand store with optional `localStorage` persistence.
  - Zero database, zero server-side health tracking, zero user tracking cookies.
- **Accessibility Engineering:**
  - Full keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape) with skip links and 2px visible focus rings.
  - Minimum 44x44px touch targets across all interactive elements.
  - Respects `prefers-reduced-motion` across all elements.
  - Low Stimulus Mode designed specifically for photophobia and cognitive fatigue.
  - **100 / 100 Lighthouse Accessibility score** achieved across all 5 routes on the live production deployment.

---

## Challenges We Ran Into
1. **Model Quota vs. Hackathon Traffic:** In production, free-tier Gemini API keys can easily encounter `RESOURCE_EXHAUSTED` (429) errors during spikes. Rather than letting the application crash or stall, we architected a resilient three-tier strategy: deterministic priors classify standard activities with 0 model calls; verified precomputed demo days serve instantaneous plans in 333ms; and a multi-model cascade catches 429s in under 200ms with honest degraded disclosures.
2. **Organic Cartography in Pure SVG:** Standard graphing libraries produce rigid stacked area charts that convey demand as a single combined mass. Concussion recovery requires isolating cognitive, sensory, and physical demands independently. We derived custom Catmull-Rom cubic splines that resample activities across a 288-point time grid, calculating symmetrical expansion along 3 independent centerlines (`y=55`, `y=110`, `y=165`) with `mix-blend-mode: multiply`.
3. **Medical Safety vs. LLM Non-Determinism:** LLMs naturally want to provide diagnosis or offer sport clearances ("You can play soccer if you feel better"). We resolved this by creating an absolute architectural barrier: clinical danger signs and restricted activity gates execute entirely before the model is ever initialized, and a 7-gate post-execution verifier purges any output that fails institutional guideline matching or uses banned diagnostic phrasing.

---

## Accomplishments We're Proud Of
- **100 / 100 Accessibility Score Across All Screens:** Verified on live production with Google Lighthouse. Complete keyboard navigation, 44px minimum touch targets, WCAG AA contrast (> 4.5:1 on all axes), and full Low Stimulus mode.
- **The Glass Box Audit (Screen S5):** Providing true algorithmic explainability where every single pipeline stage, duration, sanitized input, model call, and active verifier deletion is visible to the user.
- **Sub-Second Demo Execution:** Instant 333ms response times for all demo days with complete trace data, preserving live Gemini calls for judge exploration.
- **Greyscale-Legible Cartography:** Visual strands remain fully distinguishable by position, thickness, stroke patterns (dashed, dotted, solid), and margin badges even on monochromatic e-ink or high-contrast assistive displays.
- **39/39 Automated Tests Passing:** Robust test suite covering danger sign evaluation, boundary enforcement, registry lookups, verifier gates, and capacity calculations.

---

## What We Learned
- **Deterministic guardrails make generative AI viable in healthcare:** Trying to prompt-engineer safety into an LLM system prompt is fragile. True clinical safety requires deterministic gatekeeping before the model runs and deterministic verification after it finishes.
- **Accessibility is an essential feature, not a polish step:** For individuals recovering from brain injury, high contrast, non-animated modes, and calm typographical pacing aren't just accessibility compliance—they are the core product utility.
- **Transparency builds trust:** Showing users exactly what was inferred, what remains unknown, and what claims were purged by the verifier creates a far more responsible user experience than an authoritative black-box answer.

---

## What's Next For LumaLoad
- **Clinician Portal & Export:** Generating printable, one-page recovery load summaries formatted for primary care physicians, neurologists, and school accommodation coordinators.
- **Wearable Sensor Integration:** Integrating biometric inputs (heart rate variability, sleep stages from Apple Health / Garmin) to dynamically adapt the Capacity Baseline based on physiological recovery.
- **Formal Usability Trials:** Partnering with concussion clinics and patient advocacy organizations to run clinical usability evaluations with post-concussion syndrome patients.
- **Offline PWA Support:** Full service-worker caching for completely offline execution in dark, quiet recovery rooms without internet access.

---

## Built With
- **AI & Models:** Gemini 3.8 Flash (`@google/genai`), with cascade to Gemini 2.5 Flash and deterministic rules engine
- **Framework & Core:** Next.js 15 (App Router), React 19, TypeScript
- **State Management:** Zustand 5
- **Validation & Contracts:** Zod 3
- **Styling:** Pure CSS Tokens & Custom SVG Cartography (Zero external UI libraries)
- **Testing & Quality:** Vitest 3, Puppeteer 25, Google Lighthouse 13
- **Hosting & Infrastructure:** Vercel Production

---

## Try It Out
- **Live Production URL:** [https://lumaload.vercel.app](https://lumaload.vercel.app)
- **Interactive Recovery Canvas:** [https://lumaload.vercel.app/canvas](https://lumaload.vercel.app/canvas)
- **The Glass Box Audit Trace:** [https://lumaload.vercel.app/trace](https://lumaload.vercel.app/trace)
- **Health Diagnostic Endpoint:** [https://lumaload.vercel.app/api/health](https://lumaload.vercel.app/api/health)
- **GitHub Repository:** [https://github.com/AtchayamG/lumaload](https://github.com/AtchayamG/lumaload)
