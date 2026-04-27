# 🔍 Syntax Scanner — System Analysis & Improvement Plan

> Full audit of `system/index.html`, `system/style.css`, and `system/script.js` against the pitch spec.

---

## 🚨 Critical Bugs (Break the Game)

| # | File | Line(s) | Issue | Impact |
|---|------|---------|-------|--------|
| B1 | `script.js` | 296 | `requestAnimationFrame` is called inside `draw()`, and `draw()` calls `update()` — but `draw()` is also called once at line 300. This creates a **double-loop** on every call. | Game loop runs faster than intended; potential exponential frame stacking. |
| B2 | `script.js` | 179 | `showScanner` picks a **random item every time** an obstacle is touched, even before the player answers. If a player bounces off the wall (re-triggers collision), a new random question replaces the previous one mid-scan. | Inconsistent questions; answer checking breaks silently. |
| B3 | `script.js` | 218–228 | On **wrong answer**, `currentObstacle.solved` stays `false`, so the player immediately re-collides with the same wall and triggers a new scan the instant the timeout ends. | Player is **trapped in an infinite wrong-answer loop** on the same obstacle. |
| B4 | `script.js` | 224 | `if (obstaclesCleared === totalObstaclesInLevel)` triggers `showTransition()` — but `score` (correct/incorrect counters) **is never reset between levels**. Level 2 stats include Level 1 results. | Accuracy/error stats on every level card are cumulative and wrong. |
| B5 | `script.js` | 244–245 | After Level 3 the button says "PROCEED TO LEVEL 4", but `loadLevel(4)` uses the master dataset and generates up to 6 obstacles — **the level never ends** since only 3 datasets exist and no final-game screen fires. | Game is stuck after Level 3; no win/end state. |

---

## ⚠️ Logic & UX Deficiencies (Hurt the Experience)

| # | File | Issue | Pitch Alignment |
|---|------|-------|----------------|
| U1 | `script.js` | No **title/start screen**. Game loads directly into Level 1 with no introduction. Players don't know what to do or what the game is. | Pitch §3 emphasizes *Discovery Loop* and *Flow* — a cold start destroys first impression. |
| U2 | `script.js` | **No post-answer explanation**. When wrong, the player gets "CRITICAL LOGIC ERROR" with zero coaching on *why* the answer was wrong. | Pitch §5 Stage 4: "Every 'zap' must trace to definitions of nouns and verbs" — no teaching happens. |
| U3 | `script.js` | Scanner picks from the **full dataset randomly**, meaning the same item can appear on two different obstacles in the same level. | Reduces academic integrity; player could see `x = 5` twice and `sqrt(x) > 2` never. |
| U4 | `script.js` | **No cooldown / lock after wrong answer** before the obstacle can be retouched. Combined with B3, this allows rapid button-spam to brute-force the answer. | Undermines academic assessment. |
| U5 | `script.js` | `uploadRecording` uses `alert()` for the Firebase success confirmation. | Jarring, breaks immersion; poor UX. |
| U6 | `index.html` | **No start screen / modal** in HTML. The player sees raw game canvas immediately. | No onboarding flow. |
| U7 | `index.html` | **No final game-over / win screen** element exists in the DOM. | Can't display end-of-game summary. |
| U8 | `index.html` | No `<meta description>` tag, no semantic heading for the title. | SEO / academic submission quality gap. |

---

## 🎨 Visual & Design Gaps (Against Pitch Goals)

| # | File | Issue | Pitch Alignment |
|---|------|-------|----------------|
| V1 | `style.css` | Font is `'Courier New'` — a system default. No Google Fonts loaded. | Pitch demands *High-Dopamine Flow*; dated fonts reduce perceived quality. |
| V2 | `style.css` | Canvas is **hardcoded to 800×400**. On small screens the game overflows or appears tiny. | No responsiveness; breaks on any screen smaller than 830px wide. |
| V3 | `style.css` | The scanner overlay **appears instantly** with no entry animation (`display: none → block`). No slide-in, fade, or scan-line effect. | Pitch §3: "instant environmental reaction" — but *the UI itself* should feel alive. |
| V4 | `script.js` | Player is drawn as a **plain filled rectangle** with no visual identity. | Pitch §5 Stage 3: "Inspector persona" — there is no visual persona. |
| V5 | `script.js` | Obstacles draw **random glitch lines every frame** using `Math.random()` inside `draw()`. This is extremely CPU-wasteful and causes visual noise rather than intentional glitch art. | Uncontrolled rendering; glitch effect is unreadable. |
| V6 | `style.css` | HUD only shows Level and Objectives. **No score/accuracy live counter**, no total score display. | Players have no real-time feedback on their performance. |
| V7 | `script.js` | No **particle effect or visual celebration** when an obstacle is cleared. | Pitch §3: "bridge completes or locked door opens" — nothing visible changes except the red bar turns dark. |
| V8 | `style.css` | The `#instructions` div is positioned `bottom: -40px` — it is **clipped outside the game container** and invisible to the player. | Players never see the move controls. |

---

## 🛠️ Technical / Code Quality Issues

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| T1 | `script.js` | 296 | Game loop architecture: `draw()` should call `requestAnimationFrame(gameLoop)` where `gameLoop` calls both `update()` and `draw()` — not `requestAnimationFrame(() => { update(); draw(); })` nested inside `draw()`. |
| T2 | `script.js` | 79–107 | `loadLevel()` does not reset `score`. Needs `score = { correct: 0, incorrect: 0 };` at the start. |
| T3 | `script.js` | 165–184 | `showScanner` assigns the question to `currentObstacle` but there's no guard preventing it from being called again while `isScanning = true` (the flag is set AFTER the function is entered). |
| T4 | `script.js` | 208–216 | Firestore telemetry has no `sessionId` — impossible to group one player's session in the database. |
| T5 | `script.js` | 147–159 | `uploadRecording` is `async` but `mediaRecorder.onstop` is not awaited — errors in `storageRef.put()` are silently swallowed. |
| T6 | `index.html` | 9–11 | Firebase compat SDK v9.22.1 is used but this is an **outdated version** (current is 10.x). Not a blocker but should be updated. |
| T7 | `script.js` | 276–296 | `ctx.shadowBlur` is set inside the obstacle loop but never fully reset after the obstacle loop — this can bleed glow onto subsequent draw calls. |

---

## ✅ What's Working Well (Keep These)

- ✔ The **binary decision mechanic** (Expression vs Sentence) is correctly implemented and maps to the pitch.  
- ✔ **Three progressive datasets** (Level 1–3) with increasing complexity are solid academic content.  
- ✔ **Firebase Firestore telemetry** architecture (Stage 4 Compliance) is a great differentiator.  
- ✔ **Screen recording** feature is a thoughtful addition for submission evidence.  
- ✔ The **color scheme** (`#00ffcc` + `#ff3366` on dark) is on-brand for the cyberpunk aesthetic.  
- ✔ **Collision detection** logic in `update()` is functionally correct for a side-scroller.

---

## 📋 Prioritized Fix List

### 🔴 Priority 1 — Fix Before Anything Else
1. **[B1]** Refactor game loop to `gameLoop()` pattern.
2. **[B3]** Add `isScanning` guard at the top of `showScanner()`; add a `cooldown` flag after wrong answers.
3. **[B4]** Reset `score` inside `loadLevel()`.
4. **[B5]** Add a final win screen after Level 3 completes.

### 🟡 Priority 2 — Core UX Polish
5. **[U2]** Add a brief explanation line in the scanner UI: *"An Expression has no relation symbol (=, <, >). A Sentence does."*
6. **[U3]** Pre-assign questions to obstacles on level load (shuffle dataset, assign one per obstacle).
7. **[V8]** Fix `#instructions` positioning from `bottom: -40px` to `bottom: 10px`.
8. **[U1]** Add a start screen overlay with title + "PRESS START" button.

### 🟢 Priority 3 — Visual & Polish
9. **[V1]** Add Google Font: `Orbitron` for headings, `Share Tech Mono` for math display.
10. **[V3]** Add CSS `@keyframes scanIn` slide-down animation for scanner overlay.
11. **[V5]** Pre-compute glitch line positions on level load; don't use `Math.random()` inside `draw()`.
12. **[V7]** Add a simple particle burst (canvas) when an obstacle is solved.
13. **[V6]** Add a live `SCORE` counter to the HUD.
14. **[U7]** Add a final `#game-over-overlay` HTML element with full game summary.

---

## 📐 Summary Architecture After All Fixes

```
index.html
 ├── #start-overlay        ← NEW: Title screen
 ├── #hud                  ← UPDATE: add score display
 ├── #gameCanvas
 ├── #scanner-overlay      ← UPDATE: add scan-in animation + explanation text
 ├── #feedback-overlay
 ├── #transition-overlay   ← UPDATE: show per-level stats correctly
 ├── #game-over-overlay    ← NEW: Final win screen
 └── #instructions         ← FIX: position to be visible

script.js
 ├── gameLoop()            ← REFACTOR: clean RAF pattern
 ├── loadLevel()           ← FIX: reset score, pre-assign questions
 ├── showScanner()         ← FIX: isScanning guard
 ├── handleChoice()        ← UPDATE: add explanation + cooldown
 └── showGameOver()        ← NEW: end-game summary

style.css
 ├── Google Fonts          ← ADD: Orbitron + Share Tech Mono
 ├── @keyframes scanIn     ← ADD: scanner entry animation
 ├── #start-overlay        ← ADD
 ├── #game-over-overlay    ← ADD
 └── #instructions         ← FIX: bottom position
```
