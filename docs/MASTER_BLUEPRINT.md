# LumaLoad — Recovery Load OS
## Master Build Blueprint — Hack for Humanity Summer 2026

**Status:** BUILD LOCKED  
**Project focus:** Concussion recovery  
**Tagline:** **Plan the day. Protect the recovery.**  
**Primary goal:** Build a live, visually distinctive, evidence-grounded concussion recovery planning experience before the Devpost deadline.  
**Prototype boundary:** LumaLoad is **not** a diagnostic tool, medical device, return-to-play clearance tool, or substitute for a healthcare professional.

---

# 0. Product Thesis

A person recovering from a concussion does not experience "load" as one thing. A normal day can combine:

- cognitive demand: reading, meetings, schoolwork, decision-making
- sensory demand: screens, bright environments, noise, travel
- physical demand: walking, exercise, errands
- recovery opportunity: quiet breaks, sleep, low-demand activity

LumaLoad converts a user's day into an understandable **Recovery Load Canvas** and helps them reorganize *low-risk daily activities* into a more tolerable pattern while showing:

1. what the system inferred,
2. why it made each recommendation,
3. which evidence informed it,
4. what it is uncertain about, and
5. what decisions must remain with a healthcare professional.

The innovation is **not another symptom tracker or chatbot**.  
The core interaction is a visual, manipulable **day-load map**.

---

# 1. Competition Strategy

## Target prizes

Primary:
1. Best Tech for Concussion Recovery
2. Responsible AI
3. Best Use of AI/ML
4. Best Use of Render

Automatic/general judging opportunities:
5. Best Design
6. Best Innovation and Creativity

Do **not** claim eligibility for a student-specific prize unless the actual team satisfies its requirements.

## Why LumaLoad maps well to the published judging criteria

| Published criterion | LumaLoad evidence |
|---|---|
| Clinical & Domain Effectiveness | symptom-aware daily planning; return-to-learn/activity framing |
| Safety & Responsible Design | hard danger-sign gate; clinician-only boundaries; no diagnosis/clearance |
| Neuroscience Understanding | separates cognitive, sensory and physical demand rather than treating symptoms as one score |
| Research Foundation | curated evidence library sourced from CDC, Amsterdam consensus and Concussion Alliance |
| Technical Complexity | multi-stage workflow, structured activity analysis, retrieval, planning, verification |
| UX & Accessibility | low-stimulus mode, reduced motion, keyboard navigation, readable typography, non-color-only signals |
| AI/ML Technical Complexity | classification + evidence retrieval + plan synthesis + verification |
| Data Safety & Responsibility | local-first session, PII minimization, no raw health logs, explicit deletion |
| Innovation & Novelty | interactive Recovery Load Canvas rather than generic health dashboard/chat |
| Best Use of Render | actual Render Workflow tasks are part of the user-facing analysis pipeline |

---

# 2. Clinical and Safety Product Boundaries

These are non-negotiable.

## LumaLoad MAY

- help organize everyday low-risk activities,
- visualize anticipated cognitive/sensory/physical demand,
- suggest rest breaks and reduced clustering,
- suggest environmental accommodations such as quieter settings or shorter screen blocks,
- explain that activity should be symptom-limited,
- present reputable educational evidence,
- encourage medical follow-up,
- surface emergency danger signs,
- help prepare a concise summary to discuss with a clinician/teacher/employer.

## LumaLoad MUST NOT

- diagnose concussion,
- determine concussion severity,
- calculate a medical recovery date,
- claim that a numerical "load score" is a validated clinical threshold,
- prescribe medication,
- tell a user it is safe to drive,
- clear a user for contact/collision/fall-risk activity,
- clear a user for sport,
- replace a clinician,
- tell a user to ignore worsening symptoms,
- fabricate clinical citations,
- infer medical facts not provided by the user.

## Language rules

Prefer:
- "anticipated demand"
- "planning aid"
- "may be easier to tolerate"
- "consider discussing..."
- "based on the information you entered"
- "this is not a medical clearance"
- "your healthcare professional's instructions take priority"

Avoid:
- "safe"
- "medically safe"
- "you are recovered"
- "you can return to sport"
- "your brain can handle X"
- "recovery budget"
- "treatment plan"

## Emergency hard stop

Before any AI plan is shown, run deterministic danger-sign screening.

Examples to include:
- worsening headache that does not go away,
- repeated vomiting,
- seizure/convulsion,
- weakness/numbness/decreased coordination,
- slurred speech,
- unusual or increasing confusion/agitation,
- one pupil larger than the other or double vision,
- loss of consciousness or inability to wake/stay awake.

If any are selected:
- stop normal planning,
- do not call the LLM for a recovery plan,
- show: **"Seek emergency medical care now. Use your local emergency number or go to the nearest emergency department."**
- keep a visible disclaimer that the list is not exhaustive.

---

# 3. Locked MVP

The MVP must feel complete with **five major experiences**.

## Screen 1 — Opening / Story

Purpose: establish emotional clarity without a generic SaaS hero.

Elements:
- LumaLoad wordmark
- tagline: "Plan the day. Protect the recovery."
- short explanation
- CTA: **Map my day**
- secondary CTA: **Try the demo day**
- privacy pill: "No account required · local-first session"
- source acknowledgement: evidence-guided, not medical advice
- prominent Low Stimulus toggle

Visual: one animated three-strand "Load Ribbon" crossing a timeline.

## Screen 2 — Safety Gate + 60-Second Check-In

Flow:
1. Confirm the user has sought / is seeking appropriate medical evaluation.
2. Danger-sign checkbox screen.
3. Symptom check-in (0–10) for:
   - headache
   - dizziness/balance
   - light/noise sensitivity
   - mental fog/concentration
   - fatigue
4. Optional recovery context:
   - approximate days since injury
   - "school", "work", "both", "other"
5. prominent notice: clinician instructions override LumaLoad.

Do not ask for name, email, date of birth, address, or exact injury details in MVP.

## Screen 3 — Recovery Load Canvas (THE WOW SCREEN)

A vertical or horizontal day timeline from morning to evening.

Each event is a block with:
- label
- time/duration
- icon
- cognitive demand 0–5
- sensory demand 0–5
- physical demand 0–5
- risk tag: normal / clinician-guided / avoid-autoplanning

Under/behind the events is a custom three-strand visualization:

- Cognitive strand
- Sensory strand
- Physical strand

The strands thicken where demand clusters.

Do not show medical "safe/unsafe" thresholds.

Use wording:
- "Higher anticipated demand"
- "Demand cluster"
- "Recovery opportunity"

Capabilities:
- add event
- edit event
- drag/reorder where time permits
- choose demo template
- Analyze Day button

## Screen 4 — Luma Plan

After analysis, show no more than 3–5 prioritized recommendations.

Each recommendation card contains:
- action
- rationale
- affected event(s)
- expected type of demand reduced (cognitive / sensory / physical)
- confidence: High / Moderate / Low
- **Why?** button
- Evidence chips

Example:
"Break the 90-minute laptop block into two shorter sessions with a low-stimulation interval."

Do not claim it will accelerate recovery.

## Screen 5 — Safety & Evidence Trace

This is both the Responsible AI screen and the Render sponsor screen.

Show a trace such as:

1. Input minimized
2. Safety gate passed
3. Activities structured
4. Evidence retrieved
5. Plan generated
6. Claims verified
7. Boundary check passed

For each recommendation:
- evidence title
- short paraphrased support statement
- source organization
- external source link
- "What LumaLoad inferred"
- "What LumaLoad does not know"

Add a visible badge:
**"No diagnostic or return-to-sport decisions are delegated to AI."**

---

# 4. High-Impact Stretch Features

Only start after the MVP is deployed and stable.

1. **Low Stimulus Mode**
   - disables nonessential animation
   - lowers visual density
   - simplifies navigation
   - removes decorative background effects

2. **Clinician / School Brief**
   - one-screen printable summary of symptom trend + planned accommodations
   - clearly labeled "user-generated summary; not a medical record"

3. **Before / After Load Ribbon**
   - visually compare original and reorganized day

4. **Shareable Demo Link**
   - synthetic sample only; never expose user health data

Do NOT add:
- social feed
- chat inbox
- community forum
- gamification streaks
- generic AI assistant sidebar
- wearable integration
- complex authentication
- billing
- notifications

---

# 5. The Demo Persona and Wow Moment

Use a **fictional synthetic** demo persona.

**Maya — Day 5 after a clinician-diagnosed concussion**

Morning symptom check:
- headache 4
- dizziness 2
- light/noise sensitivity 5
- fogginess 4
- fatigue 3

Original day:
- 08:30 commute
- 09:00 lecture
- 10:30 laptop assignment
- 12:00 lunch in busy cafeteria
- 13:00 video meeting
- 14:00 study block
- 16:30 grocery store
- 18:00 planned gym/contact-risk activity

Demo sequence:
1. Map the day.
2. Show demand cluster from late morning to afternoon.
3. AI suggests splitting/relocating low-risk cognitive/sensory tasks and adding a quieter break.
4. A contact/fall-risk activity is **not** automatically cleared or optimized; show clinician boundary.
5. Open "Why?" and show evidence.
6. Open Safety & Evidence Trace and show Render workflow steps.
7. Toggle Low Stimulus Mode.
8. Briefly simulate a danger sign and show the planner hard stop.

That single demo touches nearly every judging criterion.

---

# 6. Architecture

## Recommended monorepo

```text
lumaload/
├─ apps/
│  ├─ web/                 # Next.js/React TypeScript
│  └─ api/                 # FastAPI Python
├─ workflows/
│  └─ recovery_pipeline/   # Render Workflows
├─ packages/
│  ├─ contracts/           # shared JSON schemas/types
│  └─ design-tokens/       # visual tokens
├─ evidence/
│  ├─ sources.yaml
│  ├─ evidence_chunks.json
│  └─ README.md
├─ docs/
│  ├─ MASTER_BLUEPRINT.md
│  ├─ SAFETY_MODEL.md
│  ├─ RESPONSIBLE_AI.md
│  ├─ DEMO_SCRIPT.md
│  ├─ taskstatus.md
│  └─ handover.md
├─ tests/
├─ .env.example
├─ render.yaml
└─ README.md
```

## Frontend

Recommended:
- React + TypeScript (Next.js or Vite; choose whichever the team can ship fastest)
- custom CSS variables/design tokens
- custom SVG for the Load Ribbon
- small animation library only if necessary
- avoid a chart library for the hero visualization if it looks generic

## Backend

- Python FastAPI
- Pydantic schemas
- deterministic safety/boundary engine
- evidence retrieval service
- provider-agnostic LLM adapter
- no raw health-data request logging

## Storage

MVP default: **local-first / ephemeral**.

Browser stores the current session locally.
Backend receives only the minimum structured data required for one analysis request.
Do not persist symptom/event payloads server-side in the default demo.

Optional later:
- anonymous opaque session ID
- short TTL cache for workflow result only

## Runtime AI adapter

```text
AIProvider
├─ GeminiProvider
├─ AnthropicProvider
└─ DemoDeterministicProvider
```

Important:
Coding subscriptions/usages do not imply an API key for a deployed app.

The live judging build should configure at least one actual model provider if available.
`DemoDeterministicProvider` exists so the app never becomes unusable when an API quota/key fails; clearly label demo fallback internally and do not falsely claim an LLM call occurred when it did not.

---

# 7. Render Workflow Design

Render Workflows must be functional, not decorative.

## Parent workflow

`analyze_recovery_day(input)`

### Parallel phase

- `safety_check(input)`
- `structure_activities(input.events)`
- `retrieve_evidence(input.context)`

### Sequential phase

- `compose_plan(structured_events, evidence, symptom_context)`
- `verify_plan(plan, evidence, safety_context)`
- `build_explainability_trace(verified_plan)`

### Output

```json
{
  "status": "ok",
  "safety": {
    "danger_signs_detected": false,
    "restricted_activity_flags": []
  },
  "activity_loads": [],
  "recommendations": [],
  "evidence": [],
  "verification": {
    "grounded": true,
    "boundary_passed": true,
    "unsupported_claims_removed": []
  },
  "trace": []
}
```

## Workflow rule

If `safety_check` detects a danger sign:
- short circuit plan generation,
- return emergency guidance state,
- never generate normal recovery advice.

## Render UI proof

On Safety & Evidence Trace:
- show workflow task names,
- statuses,
- durations,
- retry/fallback state where available.

Do not expose secrets, raw prompts, API keys, or hidden chain-of-thought.

---

# 8. AI Contracts

## Activity Structurer

Input:
- plain-language event
- duration
- environment hints

Output:
```json
{
  "label": "90-minute laptop assignment",
  "cognitive": 4,
  "sensory": 4,
  "physical": 1,
  "reason_codes": ["screen", "sustained_attention"],
  "risk_class": "normal_daily_activity",
  "confidence": 0.83
}
```

Scores are **product heuristics**, not clinical scales.

## Evidence Retriever

Input:
- symptoms/context
- event categories
- candidate recommendation themes

Output:
- top evidence chunks
- source id
- relevant proposition
- source URL
- publication organization

Never return a source that is not in the curated evidence registry.

## Planner

Must:
- generate at most five recommendations,
- optimize scheduling of low-risk daily activities,
- cite evidence IDs,
- state uncertainty,
- respect boundary flags.

Must not:
- invent a diagnosis,
- clear risky sport,
- prescribe medicine,
- override clinician instructions.

## Verifier

For every recommendation:
1. Is there a supporting evidence ID?
2. Does the evidence actually support the recommendation?
3. Does wording exceed the evidence?
4. Does it cross a medical boundary?
5. Does it contradict another recommendation?
6. Is uncertainty appropriate?

Unsupported or boundary-crossing recommendations are deleted.

---

# 9. Deterministic Load Heuristic

Do not pretend this is validated medicine.

The initial load map can use transparent product heuristics.

Example category priors:

| Activity | Cognitive | Sensory | Physical |
|---|---:|---:|---:|
| quiet rest | 0 | 0 | 0 |
| short walk | 1 | 1 | 2 |
| reading | 3 | 2 | 0 |
| laptop work | 4 | 4 | 0 |
| video meeting | 4 | 5 | 0 |
| busy commute | 2 | 4 | 2 |
| grocery store | 2 | 4 | 2 |
| quiet conversation | 2 | 1 | 0 |
| light stationary activity | 1 | 1 | 3 |
| contact/fall-risk sport | n/a | n/a | restricted |

Modifiers:
- duration
- screen exposure
- loud/crowded environment
- multitasking
- user-described symptom sensitivity

Label the output:
**"LumaLoad planning estimate — not a clinical score."**

---

# 10. Responsible AI / Privacy Design

## Data minimization

Do not collect by default:
- name
- email
- exact date of birth
- home address
- phone
- insurance
- medical record number
- employer/school name
- free-form injury narrative unless necessary

## PII minimization

Before model invocation:
- strip email addresses
- strip phone numbers
- strip obvious IDs
- reject unnecessary names if entered

## Logging

Never log:
- raw symptom payload
- free-form health text
- model secrets
- full prompts containing user data

Log only:
- request ID
- workflow status
- latency
- error category
- model/provider name
- safety outcome category

## User controls

- Delete local session
- Reset demo
- Explain AI use
- View evidence
- See uncertainty
- See what is sent to the model

## Prompt-injection protection

Evidence retrieval uses a curated allowlist.
Retrieved text is treated as data, not instructions.
Ignore instructions appearing inside evidence text.
Output must conform to JSON schema.
Verifier removes unsupported citations/claims.

---

# 11. Visual Direction — "Neurological Load Cartography"

## Design philosophy

**Clinical editorial + scientific visualization + calm futuristic instrument.**

It should feel like:
- a beautifully designed scientific atlas,
- a modern accessibility-first planning tool,
- a bespoke visualization product.

It must NOT feel like:
- a generic AI dashboard,
- crypto SaaS,
- a purple glassmorphism template,
- a shadcn component showcase,
- a chatbot wrapper.

## Light palette

- Canvas: `#F4F2EC`
- Surface: `#FCFBF7`
- Ink: `#17252B`
- Muted ink: `#5D6A6C`
- Cognitive: `#1E6C73`
- Sensory: `#C47B48`
- Physical: `#5D7B55`
- Danger: `#A63F3F`
- Hairline: `#D8D5CC`

## Dark palette

- Canvas: `#091215`
- Surface: `#101B1F`
- Ink: `#E8EFEC`
- Muted: `#9AABA8`
- avoid neon saturation

## Typography

- Primary: a clean geometric/humanist sans (e.g. Manrope/Inter-equivalent)
- Technical labels: IBM Plex Mono/JetBrains Mono equivalent
- generous line height
- no tiny 11px SaaS labels for important health content

## Layout

Desktop:
- left: day timeline
- center: Load Ribbon canvas
- right: recommendation/evidence inspector

Mobile:
- stacked
- sticky bottom action
- no horizontal overflow

## Signature visual

The three-strand Load Ribbon is the brand.

It should:
- animate subtly during analysis,
- never pulse continuously,
- honor `prefers-reduced-motion`,
- remain understandable in grayscale through labels/patterns/thickness,
- use no red/green-only semantics.

---

# 12. Accessibility Requirements

Must pass:
- keyboard navigation for primary interactions
- visible focus state
- semantic labels
- sufficient text contrast
- 44px+ touch targets
- reduced motion
- no flashing
- no required drag-only interaction
- Low Stimulus Mode
- textual alternative for visual load map
- non-color-only status communication

Low Stimulus Mode:
- disable decorative motion
- simplify Load Ribbon to static bands
- reduce shadows
- reduce simultaneous content
- keep essential contrast and focus states

---

# 13. API Surface

## `POST /api/analyze-day`

Request:
```json
{
  "session_id": "opaque",
  "symptoms": {
    "headache": 4,
    "dizziness": 2,
    "light_noise": 5,
    "fogginess": 4,
    "fatigue": 3
  },
  "context": {
    "days_since_injury": 5,
    "setting": "school"
  },
  "events": []
}
```

Response: workflow output contract.

## `GET /api/evidence/{id}`

Returns a curated evidence record.

## `GET /api/health`

Used for deployment verification.

No auth system in MVP.

---

# 14. Evidence Registry

Start small and high quality.

Required source families:

1. **CDC — Mild TBI / Concussion**
   - symptoms and danger signs
   - what to do after mild TBI/concussion
   - managing return to activities
   - return to school / return to sport

2. **6th International Consensus on Concussion in Sport — Amsterdam**
   - relative rest
   - early symptom-limited light activity
   - return-to-learn
   - return-to-sport
   - clinician oversight

3. **Concussion Alliance**
   - patient-friendly recovery interpretation
   - project partner relevance

Every evidence chunk must contain:
```json
{
  "id": "cdc-return-activity-001",
  "title": "...",
  "organization": "CDC",
  "url": "...",
  "claim": "...",
  "allowed_uses": ["screen_breaks", "gradual_activity"],
  "last_reviewed": "2026-09-04"
}
```

Never let the LLM invent URLs.

---

# 15. Repository Rules

Authority:
1. `docs/MASTER_BLUEPRINT.md`
2. `docs/SAFETY_MODEL.md`
3. shared contracts
4. agent handover
5. agent-local choices

Rules:
- no agent may redesign the product thesis
- no agent may add medical capabilities
- no agent may change clinical language without review
- no agent may add a new dependency without checking build impact
- no placeholder completion claims
- no TODO visible in the judging flow
- no broken routes
- no fake workflow status shown as live
- synthetic demo data only

Git branches:
- `main`
- `feat/backend-safety-workflow` — Claude
- `feat/frontend-visual-system` — Gemini
- `feat/integration-deploy` — agy

Merge only after contract tests pass.

---

# 16. Definition of Done

A judge can:

1. open a public URL without login,
2. choose Demo Day,
3. pass the safety gate,
4. see a polished Load Canvas,
5. run an analysis,
6. receive grounded recommendations,
7. open evidence for every recommendation,
8. see AI uncertainty,
9. see the Render workflow trace,
10. see a risky activity boundary,
11. activate Low Stimulus Mode,
12. trigger a danger-sign demo and observe a hard stop,
13. view the GitHub source,
14. watch a ≤4-minute demo video that matches the live product.

Anything less is not "Done."

---

# 17. Devpost Positioning

## One-line pitch

**LumaLoad maps the cognitive, sensory, and physical demand hidden inside a concussion patient's day, then uses evidence-grounded AI and deterministic safety guardrails to help reorganize low-risk activities without pretending to diagnose or clear recovery.**

## Submission focus

Choose:
**Concussion recovery**

## Sponsor/special prizes to opt into if eligible

- Best Tech for Concussion Recovery
- Responsible AI
- Best Use of Render
- Best Use of AI/ML

Do not select awards for which the actual team is not eligible.

---

# 18. Demo Video Structure — 3:30 Target

**0:00–0:25 — Problem**
"Concussion recovery isn't only about symptoms. Ordinary days stack cognitive, sensory and physical demand in ways that are hard to see."

**0:25–0:45 — Product**
Introduce LumaLoad and the Load Ribbon.

**0:45–1:45 — Wow flow**
Load Maya demo day → analyze → show cluster → optimize plan.

**1:45–2:20 — Evidence**
Open Why/Evidence Trace. Show uncertainty.

**2:20–2:50 — Safety**
Show contact-risk boundary + emergency hard stop.

**2:50–3:15 — Technical**
Show Render Workflow task graph + responsible AI architecture.

**3:15–3:30 — Close**
Low Stimulus Mode + one-sentence impact.

Never spend a minute reading architecture slides.

---

# 19. Source Foundation

Use these sources in the repo README/evidence registry and attribute them appropriately:

- CDC — Symptoms of Mild TBI and Concussion
  https://www.cdc.gov/traumatic-brain-injury/signs-symptoms/index.html

- CDC — What to Do After a Mild TBI or Concussion
  https://www.cdc.gov/traumatic-brain-injury/response/index.html

- CDC — Managing Return to Activities
  https://www.cdc.gov/heads-up/hcp/clinical-guidance/index.html

- CDC — Returning to Sports
  https://www.cdc.gov/heads-up/guidelines/returning-to-sports.html

- CDC — Returning to School After a Concussion
  https://www.cdc.gov/heads-up/guidelines/returning-to-school.html

- British Journal of Sports Medicine — Consensus statement on concussion in sport: Amsterdam 2022
  https://bjsm.bmj.com/content/57/11/695

- Concussion Alliance — Recovery Guide
  https://www.concussionalliance.org/recovery-guide

- Render — Workflows
  https://render.com/docs/workflows

- Render — Python Workflows SDK
  https://render.com/docs/workflows-sdk-python

- Hack for Humanity Summer 2026 — Devpost
  https://hack-for-humanity-summer-26.devpost.com/

---

# 20. Final Product Principle

**LumaLoad wins by being narrower, safer, more explainable, and more visually memorable than a generic AI health assistant.**

Every implementation decision should reinforce that sentence.
