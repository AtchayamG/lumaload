# LumaLoad — Devpost Submission Draft

> Update only factual implementation details after the live build is verified. Do not claim features that are not working.

## Project Name
LumaLoad — Recovery Load OS

## Tagline
Plan the day. Protect the recovery.

## Project Focus
Concussion recovery

## Elevator Pitch
LumaLoad maps the cognitive, sensory, and physical demand hidden inside a concussion patient's day, then uses evidence-grounded AI and deterministic safety guardrails to help reorganize low-risk activities without pretending to diagnose or clear recovery.

## Inspiration
Concussion recovery guidance increasingly emphasizes individualized, symptom-limited return to everyday activity rather than prolonged complete rest. But real days are messy: a commute, lecture, laptop session, noisy lunch, meeting, errands, and exercise can stack different kinds of demand. We wanted to make that invisible load visible.

## What it does
LumaLoad turns a user's day into a Recovery Load Canvas with three visual strands: cognitive, sensory, and physical demand.

Users can:
- complete a brief safety and symptom check-in,
- map or load a synthetic demo day,
- visualize clusters of anticipated demand,
- receive a small set of evidence-grounded scheduling/accommodation suggestions for low-risk daily activities,
- inspect the evidence and uncertainty behind each suggestion,
- see what the AI inferred and what it does not know,
- switch to a Low Stimulus interface,
- see hard safety boundaries for emergency danger signs and clinician-guided activities.

LumaLoad does not diagnose concussion, prescribe medication, estimate a recovery date, or provide return-to-sport clearance.

## How we built it
Frontend:
- [UPDATE AFTER BUILD]

Backend:
- FastAPI/Python
- deterministic safety rules
- curated evidence registry
- structured AI provider adapter

AI pipeline:
1. safety screening
2. activity structuring
3. evidence retrieval
4. plan composition
5. evidence/boundary verification
6. explainability trace

Render:
- [UPDATE WITH ACTUAL LIVE RENDER SERVICES]
- Render Workflows orchestrates the analysis tasks
- [UPDATE WITH REAL TASK NAMES/SCREENSHOT]

## Responsible AI
We intentionally separated medical safety from generative AI.

- danger-sign logic is deterministic
- AI cannot provide diagnosis or clearance
- recommendations require evidence IDs
- unsupported claims are rejected
- only curated sources may be cited
- uncertainty is exposed
- health data is minimized
- raw symptom/free-text payloads are not intentionally persisted in default demo mode
- model/provider failures have a safe fallback

## Research foundation
Our initial evidence registry is grounded in:
- CDC concussion/mild TBI guidance
- the Amsterdam international concussion consensus
- Concussion Alliance recovery resources

## Challenges
[UPDATE AFTER BUILD WITH 2–3 REAL TECHNICAL CHALLENGES]

## Accomplishments
[UPDATE AFTER BUILD WITH VERIFIED ITEMS]

## What we learned
[UPDATE AFTER BUILD]

## What's next
Potential future work would require clinical collaboration and validation before treating LumaLoad scores or recommendations as medical decision support.

Ideas:
- clinician-reviewed accommodation templates
- validated outcome measures
- optional encrypted longitudinal tracking
- school/work collaboration
- formal usability and accessibility studies

## Built With
[UPDATE AFTER BUILD]

## Prize selections
Select only if the live implementation genuinely qualifies:
- Best Tech for Concussion Recovery
- Responsible AI
- Best Use of Render
- Best Use of AI/ML
