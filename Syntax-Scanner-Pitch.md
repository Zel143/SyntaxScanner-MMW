# Product Pitch: The Syntax Scanner (Project "Math-Code")

## 1. Executive Summary: The Vision Pivot
We are proposing a strategic pivot from our current passive "Reading Game" concept to an active **"Math-Code Debugger."** 

In this new model, the player is no longer just walking through a site reading long texts. Instead, they become an **Inspector**, actively scanning the environment for "glitched" or "corrupted" math symbols to restore the world's logic. By identifying whether a corrupted symbol is a "Math Noun" (Expression) or a "Math Verb" (Sentence), players trigger a "zap" moment that fixes the environment.

## 2. Why We Should Pivot (Business Viability & Risk)
This pivot maximizes our academic grade while minimizing our development workload.

*   **Minimal Dev-Hours (Cost Efficiency):** Because our developer already built the walking mechanics and trigger zones, we don't need new "plumbing." We are simply replacing the "Text Box A" with a new "Scan Mechanic." This is a **low-cost pivot** because it reuses 90% of our existing code.
*   **The Rubric Guardrail (Risk Management):** Our biggest risk is submitting a project that is "too simple" for a college math course. By focusing strictly on **Module 1: The Language of Math**, we align 100% with the academic requirements. We move away from the risk of building "just a game" to the absolute certainty of delivering a valid **"Technical Academic Tool."**

## 3. The New User Experience: Friction vs. Flow
*   **Eliminating "Reading Fatigue" (Friction):** Currently, users have to stop and read long, passive text boxes. That is a massive friction point where players quit. In the "Scanner" model, the math *is* the gameplay. Finding the difference between an Expression and a Sentence becomes the core interaction.
*   **The Discovery Loop (Flow):** We create a **High-Dopamine Flow** by making the environment react instantly to the math. When a user correctly "zaps" an expression, a bridge completes or a locked door opens. The math isn't an obstacle to the game; the math *is the key* to the world.

## 4. The Engine: Corrupted Math Dataset
By defining this dataset immediately, we minimize dev hours by locking our mechanics directly to the Module 1 syllabus, preventing scope creep.

**Expressions (Math Nouns):**
1. `3x + 5`
2. `x^2 + 4`
3. `a + b`
4. `14`
5. `square root of 9`

**Sentences (Math Verbs):**
1. `3x + 5 = 11`
2. `2 < 4`
3. `x = y`
4. `1 + 1 = 2`
5. `10 > 20`

*System Risk Note: Without this strict dataset, the trigger zones will have no functional parameters, turning the project back into a passive reading simulator instead of an active logic scanner.*

## 5. Implementation Sprint Plan: Module 1 Alignment (Stages 1–4)
1.  **Stage 1: Data Structuring (The Spec):** Lock the finalized "Corrupted Math Dataset" (the 5 Nouns and 5 Verbs) into the core logic. This ensures the environment only generates obstacles strictly defined by the Module 1 syllabus, guaranteeing 100% academic compliance before any interface is drawn.
2.  **Stage 2: Engine Repurposing (The Plumbing):** Bind the existing 2D trigger zones to the dataset. When the player intersects with a zone, the engine simply calls an item from the locked array rather than generating new physics or text assets.
3.  **Stage 3: Interface Layer (The Flow):** Deploy the binary decision UI for the "Scan Mechanic." Presenting only two interactive buttons ("[Is this an Expression?]" or "[Is this a Sentence?]") upon trigger activation enforces immediate user action over passive consumption.
4.  **Stage 4: Compliance Telemetry (The Guardrail):** Execute the final QA sweep against the academic rubric. Correct choice = World restores. Incorrect choice = Penalty/Glitch. Every "zap" interaction must trace directly back to the definitions of mathematical nouns and verbs to certify the system.

## 6. Project "Math-Code" Resource Allocation

**Ranzel Virtucio | Technical Product Owner & Logic Lead**
*   **Focus:** The Rubric Guardrail (Risk Management).
*   **Responsibilities:**
    *   Oversee the Implementation Plan (Stages 1–4) to ensure 100% alignment with Module 1.
    *   Define the "Corrupted Math" dataset (selecting the specific Expressions and Sentences).
    *   Finalize Business Viability documentation to frame the project as a "Technical Academic Tool."

**Josiah Jaravilla Facultad | Systems Architect (The "Plumbing" Specialist)**
*   **Focus:** Minimal Dev-Hours (Cost Efficiency).
*   **Responsibilities:**
    *   Manage Stage 1 & 2 implementation: repurposing existing 2D triggers and walking mechanics into the Scan Mechanic.
    *   Ensure the system reuses 90% of the existing code.
    *   Handle logic for "World Restoration" or "Penalty/Glitch" triggers based on user input.

**Kalani Phoenix Guinto | UX Designer (Flow & Feedback)**
*   **Focus:** Eliminating Friction & High-Dopamine Flow.
*   **Responsibilities:**
    *   Design the Stage 3 UI: Creating the 2-choice interface without Reading Fatigue.
    *   Develop the visual "Glitch" and "Restore" assets (ensuring instant environmental reaction).
    *   Audit the Discovery Loop to make sure math feels like a "key" rather than an obstacle.

**John Gabriel Tolentino | Quality Assurance (QA) & Integration**
*   **Focus:** The Technical Guardrail.
*   **Responsibilities:**
    *   Test Trigger Zones to ensure the "Inspector" persona feels responsive.
    *   Verify all Module 1 mathematical definitions used in the game are academically accurate.
    *   Monitor the transition from "Text Box A" to the "Scan Mechanic" to prevent breaking bugs.
