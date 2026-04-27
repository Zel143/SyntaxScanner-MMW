# PROJECT PROPOSAL: THE SYNTAX SCANNER
**Project Code:** "Math-Code"
**Date:** April 27, 2026
**Course:** GED102 - Mathematics in the Modern World
**Target Module:** Module 1 (The Language of Mathematics)

---

## I. PROJECT OVERVIEW
The "Syntax Scanner" is an interactive educational tool designed to transform the learning of mathematical language from a passive reading experience into an active diagnostic simulation. This project focuses on the fundamental distinction between **Mathematical Expressions** (nouns) and **Mathematical Sentences** (verbs).

## II. THE PROBLEM STATEMENT
Current educational games often suffer from "Reading Fatigue," where students are presented with large blocks of text that lead to cognitive overload and disengagement. Our previous model (the "Reading Game") relied on these passive text boxes, which created friction in the user experience and increased the risk of the project being perceived as a simple interactive slideshow rather than a technical tool.

## III. PROPOSED SOLUTION: THE "SCANNER" PIVOT
We are pivoting to a "Math-Code Debugger" model.
*   **Persona:** The player acts as a "Syntax Inspector."
*   **Core Mechanic:** Instead of reading text, players scan "corrupted" math symbols in a 2D environment.
*   **Interaction:** Upon triggering a symbol, the player must classify it as an *Expression* or a *Sentence*.
*   **Feedback Loop:** Correct classifications "restore" the environment (opening doors/bridges), while errors cause a "glitch" penalty.

## IV. TECHNICAL FEASIBILITY & COST
This pivot is highly efficient as it reuses **90% of existing infrastructure**:
1.  **Reused Assets:** 2D walking mechanics, trigger zones, and environment collision.
2.  **New Assets:** A simple 2-choice UI overlay and a "Corrupted Math" logic array.
3.  **Efficiency:** By locking the dataset to 10 specific examples (5 Expressions, 5 Sentences), we eliminate scope creep and ensure immediate implementation.

## V. ACADEMIC ALIGNMENT (THE RUBRIC GUARDRAIL)
To ensure 100% compliance with the GED102 rubric, the scanner is hard-coded to **Module 1: The Language of Mathematics**. Every interaction validates the student's ability to identify the components of mathematical syntax, moving the project from "just a game" to a "Technical Academic Tool."

## VI. RESOURCE ALLOCATION & ROLES
*   **Ranzel Virtucio (Technical Product Owner):** Rubric compliance, Logic specification, and Academic framing.
*   **Josiah Jaravilla Facultad (Systems Architect):** Integration of 2D triggers with the Math Dataset and environment restoration logic.
*   **Kalani Phoenix Guinto (UX Designer):** Design of the "Scan Mechanic" UI and visual feedback assets (Glitch/Restore).
*   **John Gabriel Tolentino (Quality Assurance):** Academic accuracy verification and trigger zone responsiveness testing.

---
**Status:** *Awaiting Group Approval to Proceed to Stage 1 (Data Structuring).*
