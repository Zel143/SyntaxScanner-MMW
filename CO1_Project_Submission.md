# Title of the Project: The Syntax Scanner
### Subtitle: An Interactive Simulation on Mathematical Linguistics
**Course Outcome I Project** | *Mathematics in the Modern World*

---

## 1. Specific Output
The specific outputs of this project are:
1.  **The Syntax Scanner Interactive Web Tool:** A cloud-integrated simulation environment where users solve "logic glitches" by applying mathematical syntax.
2.  **Documentary Video (Simulation Demonstration):** A 5-minute narrated recording captured via the tool’s built-in recorder, demonstrating the application of mathematical language in systems logic and computer linguistics.
3.  **Real-Time Telemetry Database:** A cloud-based Firebase backend that logs student performance data for academic evaluation.

## 2. Project Description
The "Syntax Scanner" is a strategic educational pivot from traditional, passive learning models. It addresses the issue of "Reading Fatigue" in mathematical education by transforming the study of **Mathematical Syntax** into an active "debugging" experience. Instead of reading about math in a textbook, students take on the persona of a "Syntax Inspector" within a digital world corrupted by logic errors. The project leverages **Active Learning Pedagogy** and an **Immediate Feedback Loop**, where students must correctly distinguish between mathematical nouns and verbs to restore the environment. This interactive approach ensures that students move beyond simple recall toward deep structural recognition of mathematical language.

## 3. Mathematical Concepts Covered
The project is strictly aligned with **Module 1: The Nature and Language of Mathematics**, focusing on:
*   **The Language of Mathematics:** Understanding that mathematics is a language with its own grammar and syntax.
*   **Nouns vs. Verbs (Expressions vs. Sentences):** 
    *   Identifying **Expressions** (Nouns) as mathematical objects that do not state a complete thought.
    *   Identifying **Sentences** (Verbs) as mathematical statements containing relation symbols (=, <, >) that represent a complete thought with a truth value.
*   **Truth Values:** Evaluating whether a mathematical sentence is true or false within the context of the simulation.
*   **Progressive Complexity:** Moving from basic standalone terms to complex multi-term equations and inequalities.

## 4. Procedure / Execution
The execution of the project follows a four-stage "Sprint" model:
1.  **Stage 1: Data Structuring:** Mathematical datasets were bucketed into three levels of progressive complexity (Basics, Operators, and Equivalences) to guide the player through the Module 1 syllabus.
2.  **Stage 2: Engine Development:** A 2D simulation environment was built where "Glitch Obstacles" represent corrupted math. These obstacles block progression until the user interacts with the "Scan Mechanic."
3.  **Stage 3: Cloud Integration:** The system was integrated with a **Firebase Backend**. Gameplay telemetry is logged to Firestore, and the built-in screen recorder uploads demo videos to Firebase Storage, ensuring evidence-based academic progress.
4.  **Stage 4: Validation:** A HUD (Heads-Up Display) and a Level-Transition system were implemented to track accuracy and error rates, providing the user with a final performance summary upon completion of the simulation.

## 5. Tasks of Members

*   **Ranzel Virtucio (Technical Product Owner & Logic Lead):**
    *   Responsible for academic alignment with Module 1.
    *   Drafted the official CO1 documentation and framed the project as a "Technical Academic Tool."
    *   Defined the "Corrupted Math" dataset for all levels.
*   **Josiah Jaravilla Facultad (Systems Architect):**
    *   Developed the 2D engine, walking mechanics, and trigger zones.
    *   Integrated the Firebase SDK for Firestore telemetry and Storage uploads.
    *   Implemented the MediaRecorder API for the built-in screen recorder.
*   **Kalani Phoenix Guinto (UX Designer):**
    *   Designed the "Cyber-Debugger" aesthetic and the high-contrast Scanner UI.
    *   Created the feedback animations (Green Restore vs. Red Glitch) to facilitate the immediate feedback loop.
    *   Audited the "Discovery Loop" to ensure math felt like a "key" rather than a friction point.
*   **John Gabriel Tolentino (Quality Assurance & Integration):**
    *   Verified the academic accuracy of all mathematical definitions used in the system.
    *   Tested trigger responsiveness and collision detection to prevent "sequence breaking."
    *   Monitored the transition between levels to ensure data integrity in the telemetry logs.

---
**Submission Date:** May 2, 2026
