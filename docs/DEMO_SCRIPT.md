# LumaLoad — 3:30 Demo Video Shot List

**Target Duration:** 3 minutes 30 seconds  
**Speaker:** Atchayam G  
**Persona:** Solo Developer / Architect  
**Key Takeaway:** LumaLoad is a scientific load-planning instrument for concussion recovery, powered by deterministic clinical safety and evidence-grounded AI.

---

### Shot 1: The Problem & Opening Thesis (0:00 – 0:35)
- **Screen:** S1 Story (`/`) in Light Mode.
- **Action:** Show wordmark, tagline *"Plan the day. Protect the recovery."*, and the organic animated SVG Load Ribbon rendering the hero demo.
- **Voiceover:** *"Recovering from a concussion is not a single number. An everyday day stacks cognitive, sensory, and physical demands on top of a brain capacity lowered by fatigue, sleep disruption, and anxiety. Existing apps offer generic symptom diaries or ungrounded chatbots. LumaLoad maps hidden neurological demand across the day and guides safe, low-risk pacing."*
- **Visual:** Click "Try Maya's day" to launch the synthetic persona.

---

### Shot 2: Deterministic Safety Hard Stop (0:35 – 1:05)
- **Screen:** S2 Check-In (`/check-in`).
- **Action:** Select Maya's persona. Show the 8 CDC danger signs checklist. Check *"A headache that gets worse and does not go away"*. Click submit.
- **Visual:** Immediate transition to the calm, high-contrast, non-animated `EmergencyStop` screen (`HALTED`).
- **Voiceover:** *"Safety is never delegated to AI. When any of the 8 CDC danger signs are checked, the entire AI pipeline is hard-halted before any LLM is called. We tell the user to seek emergency medical care immediately."*
- **Action:** Uncheck the danger sign to show the normal check-in flow with 8 symptom sliders and context questions.

---

### Shot 3: Recovery Load Canvas & The Load Ribbon (1:05 – 1:45)
- **Screen:** S3 Recovery Load Canvas (`/canvas`).
- **Action:** Point out Maya's 8 events on the 24-hour timeline.
- **Visual:** Focus on the custom SVG Load Ribbon showing Cognitive (teal), Sensory (amber), and Physical (sage) demand ribbons flowing over the Capacity Baseline (purple floor).
- **Voiceover:** *"Notice the afternoon stack: laptop work, noisy lunch, video meeting, and study block push demand into Maya's diminished capacity, triggering two high-severity pressure points. Also notice Maya's evening 5-a-side football: LumaLoad deterministically identifies it as contact sport and locks it with a Clinician Boundary card. We never clear sport."*
- **Action:** Click "Analyze my day". Show real-time loading feedback.

---

### Shot 4: The Luma Plan & Evidence Grounding (1:45 – 2:30)
- **Screen:** S4 Luma Plan (`/plan`).
- **Action:** Review the synthesized recommendations (e.g. splitting the study block, taking a quiet lunch).
- **Visual:** Expand the "Why?" drawer on a recommendation card. Show the verified evidence citation chip. Click it to show it linking out to the live CDC HEADS UP page.
- **Voiceover:** *"Every recommendation must cite a verified institutional guideline from our static registry. No fabricated citations, no arbitrary URLs. Notice our transparency cards: 'What LumaLoad inferred' and 'What LumaLoad does not know'."*
- **Action:** Show the Before/After ribbon comparison showing reduced demand peaks.

---

### Shot 5: Responsible AI & The Glass Box Trace (2:30 – 3:05)
- **Screen:** S5 Glass Box Trace (`/trace`).
- **Action:** Scroll through the 7 execution stages with exact millisecond timings and sanitized payloads.
- **Visual:** Highlight the "Unsupported Claims Purged" section: show a test claim that contained banned language or hallucinated citations being stripped by our deterministic verifier.
- **Voiceover:** *"The Glass Box exposes the entire pipeline: PII sanitization, parallel activity structuring and evidence retrieval, Gemini 3.8 Flash synthesis, and our 7-layer verifier that actively purges unsupported claims."*

---

### Shot 6: Accessibility & Low Stimulus Mode (3:05 – 3:30)
- **Screen:** Canvas / Plan.
- **Action:** Toggle **Low Stimulus Mode**.
- **Visual:** Watch the interface instantaneously flatten: animations cease, ribbons become clean solid bands, contrast softens while maintaining strict 4.5:1 text legibility.
- **Action:** Toggle "Read as text" to show the screen-reader accessible data table for the ribbon.
- **Voiceover:** *"Designed for individuals recovering from neurological injury: full keyboard navigation, zero flashing, high text contrast, and Low Stimulus Mode for photophobia and cognitive fatigue. LumaLoad: Plan the day, protect the recovery."*
