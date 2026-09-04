# LumaLoad — 18-Hour Build Checklist

**Mode:** autonomous parallel build  
**Verification:** critical-path checkpoints only  
**Priority:** functioning live demo > medical safety > visual distinctiveness > extra features  
**Feature freeze:** approximately 02:30 IST or earlier if the MVP is stable  
**Submission hard deadline:** 09:15 IST, 5 September 2026  
**Internal submit target:** 08:15 IST  
**Absolute final freeze:** 08:45 IST

---

## Agent lanes

- **Claude:** contracts, API, safety, evidence, AI, Render workflow, backend tests
- **Gemini:** frontend, signature visualization, accessibility, responsive polish
- **agy:** integration, Render deployment, E2E QA, README, Devpost assets

---

- [ ] **1. Bootstrap and lock contracts**
  Spec ref: `MASTER_BLUEPRINT > Architecture + API Surface`
  What to build: monorepo skeleton, shared schemas, fixture JSON, env template, branches.
  Acceptance: frontend can render fixture; backend validates same contract.
  Verify: typecheck + schema test.

- [ ] **2. Build deterministic safety engine**
  Spec ref: `MASTER_BLUEPRINT > Clinical and Safety Product Boundaries`
  What to build: danger signs, restricted-activity classes, hard-stop response.
  Acceptance: danger signs never reach normal planner; risky sport never receives clearance.
  Verify: unit tests.

- [ ] **3. Curate evidence registry**
  Spec ref: `MASTER_BLUEPRINT > Evidence Registry`
  What to build: 12–25 compact evidence chunks from CDC, Amsterdam consensus, Concussion Alliance.
  Acceptance: every chunk has fixed ID, source, URL, allowed uses.
  Verify: registry validation script.

- [ ] **4. Frontend shell + Safety/Check-In**
  Spec ref: `MASTER_BLUEPRINT > Screens 1–2`
  What to build: opening, safety gate, symptom check-in, low-stimulus toggle.
  Acceptance: polished at desktop/mobile; keyboard usable.
  Verify: manual viewport check.

- [ ] **5. Signature Recovery Load Canvas**
  Spec ref: `MASTER_BLUEPRINT > Screen 3 + Visual Direction`
  What to build: day timeline, events, custom Load Ribbon, demo persona.
  Acceptance: wow moment exists without backend.
  Verify: fixture demo screenshot.

- [ ] **6. Render Workflow pipeline**
  Spec ref: `MASTER_BLUEPRINT > Render Workflow Design`
  What to build: safety, structure, retrieve, compose, verify, trace tasks.
  Acceptance: one real workflow run returns schema-valid response.
  Verify: Render task run + API test.

- [ ] **7. AI provider + verification**
  Spec ref: `MASTER_BLUEPRINT > AI Contracts`
  What to build: provider adapter, structured output, evidence IDs, fallback, verifier.
  Acceptance: malformed/unsupported output cannot reach UI.
  Verify: contract + failure tests.

- [ ] **8. Luma Plan + Evidence Trace UI**
  Spec ref: `MASTER_BLUEPRINT > Screens 4–5`
  What to build: recommendations, Why drawer, uncertainty, evidence, real workflow trace.
  Acceptance: every recommendation is explainable.
  Verify: end-to-end demo fixture/live run.

- [ ] **9. Integrate and deploy early**
  Spec ref: `MASTER_BLUEPRINT > Definition of Done`
  What to build: public frontend/API/workflow deployment.
  Acceptance: judge can complete happy path without local setup.
  Verify: fresh incognito browser.

- [ ] **10. Accessibility + visual QA pass**
  Spec ref: `MASTER_BLUEPRINT > Accessibility`
  What to build: reduced motion, low stimulus, focus, mobile fixes, loading/error states.
  Acceptance: no overflow/placeholders/broken state.
  Verify: 1440/1024/768/390 viewport pass.

- [ ] **11. Safety failure demonstration**
  Spec ref: `MASTER_BLUEPRINT > Emergency hard stop`
  What to build: synthetic danger-sign demo path plus model/workflow fallback.
  Acceptance: safety behavior is obvious and non-AI-dependent.
  Verify: manual demo + test.

- [ ] **12. Devpost handoff**
  Spec ref: `MASTER_BLUEPRINT > Devpost Positioning + Demo Video`
  What to build: README, screenshots, architecture graphic, submission copy, ≤4-min video, prize selections.
  Acceptance: submission draft complete by 08:15 IST; final QA before 08:45.
  Verify: all Devpost required fields and links checked.

---

# Suggested clock plan from ~15:20 IST

**15:20–16:00** — repo/contracts/evidence schema/UI fixture lock  
**16:00–19:30** — parallel backend + frontend + Render workflow  
**19:30–21:00** — first integration and first public deploy  
**21:00–00:30** — AI/evidence verification + screens 4–5 + real workflow trace  
**00:30–02:30** — safety tests + visual polish + responsive + accessibility  
**02:30** — FEATURE FREEZE  
**02:30–04:30** — E2E fixes, deployment reliability, failure states  
**04:30–05:45** — README, screenshots, architecture graphic, Devpost copy  
**05:45–07:15** — record/edit demo video  
**07:15–08:15** — upload video, fill submission, select eligible prizes  
**08:15–08:45** — fresh-browser final verification + submit  
**08:45–09:15** — emergency buffer only

---

# Non-negotiable kill list

If behind schedule, cut in this order:
1. trends/history
2. printable clinician brief
3. drag-and-drop
4. account/auth
5. persistent database
6. fancy transitions

Never cut:
- public working URL
- danger-sign safety
- evidence trace
- Load Ribbon
- real Render workflow
- mobile usability
- video
- GitHub source
