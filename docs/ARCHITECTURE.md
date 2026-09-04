# LumaLoad System Architecture

> **Architecture:** Single-process Next.js 15 App Router application with strict TypeScript contracts, deterministic safety boundaries, and Google Gemini 3.8 Flash structured synthesis.

---

## 1. High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client (Next.js 15)                           │
│  - Session State (Zustand -> localStorage only)                        │
│  - S1 Story / Landing (S1)                                            │
│  - S2 Safety Gate & Check-in (S2)                                      │
│  - S3 Recovery Load Canvas + SVG Load Ribbon (S3)                      │
│  - S4 Luma Plan + Evidence Why Drawer (S4)                             │
│  - S5 Glass Box Execution Trace (S5)                                   │
│  - Low Stimulus Controller + Tokens CSS                                │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ JSON POST (DaySubmission)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     API Boundary: /api/analyze-day                     │
│                     (export const maxDuration = 60)                    │
│                                                                        │
│  1. [Sanitize] deterministic PII strip (emails, phones, numbers)       │
│  2. [Safety Check] 8 CDC danger signs -> Emergency Halt if any         │
│     classify restricted events -> locked Clinician Boundary            │
│     triage mood/anxiety -> Distress Signpost                           │
│                                                                        │
│         ┌──────────────────────────┴──────────────────────────┐        │
│         ▼                                                     ▼        │
│  3. [Structure Activities]                             4. [Retrieve]   │
│     Gemini structured output                              Evidence Scorer│
│     (fallback: deterministic priors)                      top 8 from static│
│         │                                                 registry json│
│         └──────────────────────────┬──────────────────────────┘        │
│                                    │                                   │
│  5. [Compose Plan] Gemini synthesis (<= 5 recommendations)             │
│     enforced evidence ID citation from retrieved set                   │
│                                    │                                   │
│  6. [Verify Plan] Seven-stage verification pipeline                    │
│     - Evidence existence & relevance                                   │
│     - Banned language check                                            │
│     - Restricted activity check                                        │
│     - Model overreaching verifier                                      │
│     (unsupported claims removed & logged to trace)                     │
│                                    │                                   │
│  7. [Build Trace] Structured Glass Box response assembly               │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
     Google Gemini 3.8 Flash API         Static Curated Evidence
     (@google/genai structured output)   (src/data/evidence.json)
```

---

## 2. Directory Structure & Key Modules

- `src/lib/contracts/`: Zod definitions for symptoms, recovery context, events, load models, recommendations, and execution traces.
- `src/lib/safety/`: Deterministic clinical rules (danger signs, restricted activities, distress triggers, banned language enforcement).
- `src/lib/load/`: Demand heuristics (category priors, duration & environment multipliers, symptom multipliers, capacity baseline, and pressure points).
- `src/lib/evidence/`: Static registry loader and semantic/tag-based relevance retrieval.
- `src/lib/ai/`: Gemini provider integration with structured output schemas and deterministic rules engine fallback.
- `src/lib/pipeline/`: Seven-stage orchestrator measuring millisecond durations and producing transparent execution traces.
- `src/components/ribbon/`: Hand-rolled SVG Load Ribbon and Capacity Baseline visualization with full accessible text alternatives.
- `src/styles/tokens.css`: Pure CSS design tokens ("Neurological Load Cartography") supporting light, dark, and low-stimulus modes.
