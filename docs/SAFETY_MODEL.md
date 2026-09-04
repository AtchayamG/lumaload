# LumaLoad Clinical and Safety Model

> **Status:** LOCKED SPECIFICATION — DETERMINISTIC ENFORCEMENT  
> **Core Principle:** Deterministic safety is strictly decoupled from generative AI. Generative models never evaluate danger signs, never clear sports or driving, and never override clinical boundaries.

---

## 1. What LumaLoad MAY Do

- Organize everyday low-risk activities (study, light chores, reading, quiet breaks, meals).
- Visualize anticipated cognitive, sensory, and physical load across a 24-hour timeline.
- Suggest rest breaks, pacing accommodations, and decreased task clustering.
- Suggest environmental accommodations (dimmer lighting, quieter spaces, reduced screen chunks).
- Emphasize that all activities must remain symptom-limited.
- Ground all suggestions in curated, verified evidence from reputable public health authorities (CDC, Amsterdam Consensus, Concussion Alliance).
- Encourage ongoing medical evaluation with licensed healthcare professionals.
- Deterministically surface emergency danger signs.
- Provide a structured summary for discussion with clinicians, educators, or employers.

---

## 2. What LumaLoad MUST NOT Do

- **Never** diagnose concussion or any other medical condition.
- **Never** determine injury severity or classify concussion grades.
- **Never** predict a clinical recovery date or time horizon.
- **Never** claim that any numerical load estimate is a validated clinical metric.
- **Never** prescribe medications, supplements, or medical therapies.
- **Never** advise that it is safe to drive, operate heavy machinery, or bike.
- **Never** clear anyone for contact sport, collision sport, or fall-risk activity.
- **Never** replace or supersede the judgment of a licensed healthcare provider.
- **Never** advise anyone to push through or ignore escalating symptoms.
- **Never** fabricate clinical citations or emit arbitrary external URLs.
- **Never** infer unprovided medical facts about the user.

---

## 3. Deterministic Safety Boundaries

### 3.1 Emergency Danger Signs Hard Stop (CDC)
Screened **before** any AI model call. If any of the following 8 signs is reported:
1. Headache that gets worse and does not go away
2. Repeated vomiting or nausea
3. Seizure or convulsion
4. Weakness, numbness, or decreased coordination
5. Slurred speech
6. Unusual behaviour, increased confusion, restlessness, or agitation
7. Unequal pupil size or double vision
8. Loss of consciousness, drowsiness, or inability to awaken

**Action:** The analysis pipeline is immediately halted (`HALTED`). All generative model calls are skipped. The user is directed to emergency medical services immediately.

### 3.2 Restricted Activities
Activities classified as `restricted` (e.g. `contact_sport`, `driving`, high-intensity exercise, solo swimming, climbing) are locked with an immutable **ClinicianBoundary** card. They are never scheduled, modified, or cleared by AI.

### 3.3 Distress Signposting (Mental Health Arm)
When self-reported `mood >= 8`, `anxiety >= 8`, or the "feeling unable to cope" indicator is checked, the system renders a warm, deterministic distress support banner signposting free, confidential support services (including 988 in the US and findahelpline.com internationally). Generative models can neither trigger nor suppress this component.

### 3.4 Language Enforcement
All text emitted by the recommendation engine is scanned for banned phrases (e.g. "safe to return", "diagnose", "recovery budget", "guaranteed"). Any recommendation failing this check is deleted deterministically and logged in the Glass Box audit trace.
