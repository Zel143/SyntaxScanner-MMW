/**
 * THE SYNTAX SCANNER — script.js v3.0
 *
 * BUGS FIXED:
 * [B1] Game loop refactored to clean gameLoop() RAF pattern
 * [B2] Questions pre-assigned to obstacles at level load (no mid-scan replacement)
 * [B3] isScanning guard + cooldown prevents infinite wrong-answer trap
 * [B4] score resets inside loadLevel()
 * [B5] showGameOver() fires after Level 3 — proper end state
 *
 * UX IMPROVEMENTS:
 * [U1] Start screen with legend
 * [U2] Post-answer explanation shown in scanner UI
 * [U3] Shuffled dataset, one unique item pre-assigned per obstacle
 * [U5] Toast replaces alert() for recording uploads
 *
 * VISUAL IMPROVEMENTS:
 * [V5] Glitch lines pre-computed per obstacle, not randomized every frame
 * [V6] Live score display in HUD
 * [V7] Particle burst on obstacle cleared
 * [V8] Instructions now visible (CSS fix)
 *
 * TECHNICAL:
 * [T4] sessionId added to Firestore telemetry
 * [T7] ctx.shadowBlur fully reset after every draw pass
 */

// ═══════════════════════════════════════════════════════════════════
// 1. FIREBASE
// ═══════════════════════════════════════════════════════════════════
let db, storage;
try {
    if (typeof firebaseConfig !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        console.log('Firebase Initialized.');
    } else {
        throw new Error('firebaseConfig not defined.');
    }
} catch (e) {
    console.warn('Firebase running in Local Mode:', e.message);
}

// [T4] Unique session ID for telemetry grouping
const sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

// ═══════════════════════════════════════════════════════════════════
// 2. CANVAS
// ═══════════════════════════════════════════════════════════════════
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = 800;
canvas.height = 400;

// ═══════════════════════════════════════════════════════════════════
// 3. DATASETS — each item has an explanation [U2]
// ═══════════════════════════════════════════════════════════════════
const datasets = {
    level1: [
        { text: '42',      type: 'expression', explain: '"42" is just a number — a Math Noun. No relation symbol.' },
        { text: '-7',      type: 'expression', explain: '"-7" is a numerical expression — a standalone Math Noun.' },
        { text: 'x',       type: 'expression', explain: '"x" is a variable — a Math Noun representing an unknown value.' },
        { text: 'y',       type: 'expression', explain: '"y" alone names a value but makes no claim — Math Noun.' },
        { text: 'π',       type: 'expression', explain: '"π" is a constant (≈3.14) — a Math Noun with no relation.' },
        { text: '3 = 3',   type: 'sentence',   explain: '"=" makes a claim of equality — this is a true Math Sentence.' },
        { text: 'x = 5',   type: 'sentence',   explain: '"x = 5" states a relationship between x and 5 — Math Sentence.' },
        { text: '10 < 2',  type: 'sentence',   explain: '"<" is a relation symbol. This is a false, but valid, Math Sentence.' },
        { text: 'y > 0',   type: 'sentence',   explain: '">" expresses a comparison — this is a Math Sentence.' },
        { text: 'a = b',   type: 'sentence',   explain: '"a = b" asserts that two expressions are equal — Math Sentence.' },
    ],
    level2: [
        { text: '2x + 1',      type: 'expression', explain: '"2x + 1" combines terms but makes no claim. Math Noun.' },
        { text: 'x² − 4',      type: 'expression', explain: 'A polynomial — no "=" or inequality. Math Noun.' },
        { text: '√16',          type: 'expression', explain: '"√16" evaluates to 4 — it names a value. Math Noun.' },
        { text: '(a + b) / 2', type: 'expression', explain: 'A formula fragment with no relation symbol — Math Noun.' },
        { text: '3(x − y)',    type: 'expression', explain: 'A product expression with no claim attached — Math Noun.' },
        { text: '2x + 1 = 7',  type: 'sentence',   explain: '"=" makes this an equation — a Math Sentence.' },
        { text: 'x² − 4 = 0',  type: 'sentence',   explain: 'Setting an expression equal to 0 creates a Math Sentence.' },
        { text: 'a + b < 10',  type: 'sentence',   explain: '"<" is a relation — this inequality is a Math Sentence.' },
        { text: '3x = 15',     type: 'sentence',   explain: '"=" creates an equation — a Math Sentence.' },
        { text: '√x > 2',      type: 'sentence',   explain: '">" establishes a comparison — Math Sentence.' },
    ],
    level3: [
        { text: '(x²+2x+1)/(x+1)', type: 'expression', explain: 'A rational expression — complex but no relation. Math Noun.' },
        { text: '|x − 5| + 3',      type: 'expression', explain: 'Absolute value expression — no inequality symbol. Math Noun.' },
        { text: 'sin(θ)·cos(θ)',     type: 'expression', explain: 'A trig product — two functions combined. Math Noun.' },
        { text: 'log₂(8)',           type: 'expression', explain: '"log₂(8)" equals 3 — it names a value. Math Noun.' },
        { text: 'Σ(i=1→10, n)',      type: 'expression', explain: 'A summation — represents a sum value. Math Noun.' },
        { text: 'x² + y² = r²',     type: 'sentence',   explain: 'The circle equation — "=" makes it a Math Sentence.' },
        { text: 'a² + b² = c²',     type: 'sentence',   explain: "Pythagoras' theorem — a famous Math Sentence." },
        { text: '2x − 3 ≥ x + 5',  type: 'sentence',   explain: '"≥" is a relation symbol — Math Sentence (inequality).' },
        { text: 'eⁱᵖⁱ = −1',       type: 'sentence',   explain: "Euler's identity — the most elegant Math Sentence." },
        { text: '|x| < 5',          type: 'sentence',   explain: '"<" establishes a bound — Math Sentence.' },
    ]
};

// ═══════════════════════════════════════════════════════════════════
// 4. STATE
// ═══════════════════════════════════════════════════════════════════
let currentLevel         = 1;
let obstaclesCleared     = 0;
let totalObstaclesInLevel = 0;
let score                = { correct: 0, incorrect: 0, points: 0 };
// gameState: 'start' | 'playing' | 'scanning' | 'transitioning' | 'gameover'
let gameState            = 'start';
let currentObstacle      = null;
let obstacles            = [];
let particles            = [];   // [V7]
let isCoolingDown        = false; // [B3]
let animFrameId          = null;

const player = {
    x: 50, y: 184, width: 32, height: 32, speed: 4, color: '#00ffcc'
};
const keys = {};

// ═══════════════════════════════════════════════════════════════════
// 5. UTILITIES
// ═══════════════════════════════════════════════════════════════════
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showToast(msg) { // [U5]
    const t = document.getElementById('upload-toast');
    t.innerText = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
}

// ═══════════════════════════════════════════════════════════════════
// 6. LEVEL MANAGEMENT
// ═══════════════════════════════════════════════════════════════════
function loadLevel(levelNum) {
    currentLevel          = levelNum;
    obstaclesCleared      = 0;
    score                 = { correct: 0, incorrect: 0, points: 0 }; // [B4]
    isCoolingDown         = false;
    particles             = [];
    player.x              = 50;
    player.y              = 184;
    totalObstaclesInLevel = Math.min(levelNum + 1, 6);

    // [U3] Shuffle pool and pre-assign one unique item per obstacle
    const pool = datasets[`level${Math.min(levelNum, 3)}`];
    const shuffled = shuffle(pool);

    obstacles = [];
    const spacing = (canvas.width - 200) / totalObstaclesInLevel;

    for (let i = 0; i < totalObstaclesInLevel; i++) {
        const item = shuffled[i % shuffled.length];

        // [V5] Pre-compute glitch lines (not randomized every frame)
        const glitchLines = Array.from({ length: 6 }, () => ({
            y1: Math.random() * canvas.height,
            y2: Math.random() * canvas.height,
            alpha: Math.random() * 0.6 + 0.2
        }));

        obstacles.push({
            x: 180 + i * spacing,
            y: 0,
            width: 30,
            height: canvas.height,
            solved: false,
            text:    item.text,
            answer:  item.type,
            explain: item.explain,
            glitchLines,
        });
    }

    updateHUD();
    document.getElementById('transition-overlay').classList.add('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    gameState = 'playing';
}

function updateHUD() {
    document.getElementById('level-display').innerText    = `LEVEL: ${currentLevel}`;
    document.getElementById('progress-display').innerText = `OBJECTIVES: ${obstaclesCleared} / ${totalObstaclesInLevel}`;
    document.getElementById('score-display').innerText    = `SCORE: ${score.points}`; // [V6]
}

// ═══════════════════════════════════════════════════════════════════
// 7. START SCREEN [U1]
// ═══════════════════════════════════════════════════════════════════
document.getElementById('btn-start').addEventListener('click', () => {
    document.getElementById('start-overlay').classList.add('hidden');
    loadLevel(1);
    if (!animFrameId) gameLoop(); // [B1] start clean loop
});

// ═══════════════════════════════════════════════════════════════════
// 8. SCREEN RECORDING
// ═══════════════════════════════════════════════════════════════════
let mediaRecorder, recordedChunks = [], isRecording = false;

document.getElementById('btn-record').addEventListener('click', () => {
    if (!isRecording) startRecording();
    else stopRecording();
});

function startRecording() {
    recordedChunks = [];
    const stream = canvas.captureStream(30);
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = uploadRecording;
    mediaRecorder.start();
    isRecording = true;
    document.getElementById('btn-record').innerText = '⏹ STOP';
    document.getElementById('btn-record').classList.add('recording');
    document.getElementById('recording-status').classList.remove('hidden');
}

function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
    document.getElementById('btn-record').innerText = '⏺ REC';
    document.getElementById('btn-record').classList.remove('recording');
    document.getElementById('recording-status').classList.add('hidden');
}

async function uploadRecording() {
    const blob     = new Blob(recordedChunks, { type: 'video/webm' });
    const filename = `recording_L${currentLevel}_${Date.now()}.webm`;
    try {
        if (storage) {
            const ref = storage.ref(`recordings/${filename}`);
            await ref.put(blob);
            showToast('✔ Recording saved to Cloud!'); // [U5]
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            showToast('✔ Recording downloaded!');
        }
    } catch (err) {
        console.error('Upload failed:', err);
        showToast('⚠ Upload failed — see console.');
    }
}

// ═══════════════════════════════════════════════════════════════════
// 9. SCANNER
// ═══════════════════════════════════════════════════════════════════
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup',   e => keys[e.code] = false);

function showScanner(obstacle) {
    // [B3] Guard: only open if actively playing and not on cooldown
    if (gameState !== 'playing' || isCoolingDown) return;
    gameState        = 'scanning';
    currentObstacle  = obstacle;

    document.getElementById('math-display').innerText = obstacle.text;
    document.getElementById('scanner-explanation').classList.add('hidden');
    document.getElementById('scanner-explanation').innerText = '';
    document.getElementById('btn-expression').disabled = false;
    document.getElementById('btn-sentence').disabled   = false;

    // Animate timer bar
    const fill = document.getElementById('scanner-timer-fill');
    fill.style.transition = 'none';
    fill.style.width = '100%';
    requestAnimationFrame(() => {
        fill.style.transition = 'width 8s linear';
        fill.style.width = '0%';
    });

    document.getElementById('scanner-overlay').classList.remove('hidden');
}

function handleChoice(choice) {
    if (gameState !== 'scanning') return;

    // Disable buttons immediately
    document.getElementById('btn-expression').disabled = true;
    document.getElementById('btn-sentence').disabled   = true;

    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackText    = document.getElementById('feedback-text');
    const explanationEl   = document.getElementById('scanner-explanation');
    const isCorrect       = choice === currentObstacle.answer;

    // [U2] Show explanation regardless of outcome
    explanationEl.innerText = `💡 ${currentObstacle.explain}`;
    explanationEl.classList.remove('hidden');

    feedbackOverlay.classList.remove('hidden');

    if (isCorrect) {
        score.correct++;
        score.points += 100 * currentLevel; // harder levels = more points
        feedbackText.innerText  = '✔  ENVIRONMENT RESTORED';
        feedbackText.style.color = '#00ffcc';
        feedbackOverlay.className = 'restore-flash';
        currentObstacle.solved = true;
        obstaclesCleared++;
        spawnParticles(currentObstacle.x + 15, canvas.height / 2); // [V7]
        updateHUD();
    } else {
        score.incorrect++;
        feedbackText.innerText  = '✖  CRITICAL LOGIC ERROR';
        feedbackText.style.color = '#ff3366';
        feedbackOverlay.className = 'glitch-flash';
        // [B3] Cooldown prevents immediate re-trigger after wrong answer
        isCoolingDown = true;
        setTimeout(() => { isCoolingDown = false; }, 1600);
    }

    // [T4] Telemetry with sessionId
    if (db) {
        db.collection('telemetry').add({
            sessionId,
            level:     currentLevel,
            math:      currentObstacle.text,
            choice,
            correct:   isCorrect,
            timestamp: firebase.firestore.Timestamp.now()
        }).catch(err => console.warn('Telemetry error:', err));
    }

    setTimeout(() => {
        document.getElementById('scanner-overlay').classList.add('hidden');
        feedbackOverlay.classList.add('hidden');
        feedbackOverlay.className = 'hidden';
        currentObstacle = null;
        gameState = 'playing';

        if (obstaclesCleared === totalObstaclesInLevel) {
            if (currentLevel >= 3) {
                showGameOver(); // [B5]
            } else {
                showTransition();
            }
        }
    }, 1800);
}

document.getElementById('btn-expression').addEventListener('click', () => handleChoice('expression'));
document.getElementById('btn-sentence').addEventListener('click',   () => handleChoice('sentence'));

// ═══════════════════════════════════════════════════════════════════
// 10. PARTICLES [V7]
// ═══════════════════════════════════════════════════════════════════
function spawnParticles(x, y) {
    for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particles.push({
            x, y,
            vx:    Math.cos(angle) * speed,
            vy:    Math.sin(angle) * speed,
            life:  1.0,
            decay: Math.random() * 0.03 + 0.02,
            size:  Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? '#00ffcc' : '#ffffff'
        });
    }
}

function updateParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.08; // gravity
        p.life -= p.decay;
    });
}

function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle   = p.color;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// ═══════════════════════════════════════════════════════════════════
// 11. LEVEL TRANSITIONS
// ═══════════════════════════════════════════════════════════════════
function showTransition() {
    gameState = 'transitioning';
    const total    = score.correct + score.incorrect;
    const accuracy = total > 0 ? Math.round((score.correct / total) * 100) : 0;

    document.getElementById('accuracy-stat').innerText = accuracy;
    document.getElementById('correct-stat').innerText  = score.correct;
    document.getElementById('error-stat').innerText    = score.incorrect;
    document.getElementById('transition-title').innerText = 'SECTOR RESTORED';
    document.getElementById('btn-next').innerText = `PROCEED TO LEVEL ${currentLevel + 1}`;
    document.getElementById('transition-overlay').classList.remove('hidden');
}

document.getElementById('btn-next').addEventListener('click', () => {
    loadLevel(currentLevel + 1);
});

function showGameOver() { // [B5]
    gameState = 'gameover';
    const total    = score.correct + score.incorrect;
    const accuracy = total > 0 ? Math.round((score.correct / total) * 100) : 0;

    document.getElementById('final-accuracy').innerText = `${accuracy}%`;
    document.getElementById('final-score').innerText    = score.points;
    document.getElementById('final-errors').innerText   = score.incorrect;
    document.getElementById('game-over-overlay').classList.remove('hidden');
}

document.getElementById('btn-restart').addEventListener('click', () => {
    loadLevel(1);
});

// ═══════════════════════════════════════════════════════════════════
// 12. UPDATE
// ═══════════════════════════════════════════════════════════════════
function update() {
    if (gameState !== 'playing') return;

    if (keys['ArrowLeft']  || keys['KeyA']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
    if (keys['ArrowUp']    || keys['KeyW']) player.y -= player.speed;
    if (keys['ArrowDown']  || keys['KeyS']) player.y += player.speed;

    player.x = Math.max(0, Math.min(canvas.width  - player.width,  player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    for (const obs of obstacles) {
        if (!obs.solved &&
            player.x < obs.x + obs.width  &&
            player.x + player.width  > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {

            // Push player back so they don't clip inside [B2 side-effect fix]
            player.x = obs.x - player.width - 2;
            showScanner(obs);
            break;
        }
    }

    updateParticles();
}

// ═══════════════════════════════════════════════════════════════════
// 13. DRAW
// ═══════════════════════════════════════════════════════════════════
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid background
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth   = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 40) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }

    // Obstacles
    obstacles.forEach(obs => {
        if (!obs.solved) {
            // Red glitch wall
            ctx.fillStyle  = '#ff3366';
            ctx.shadowBlur  = 18;
            ctx.shadowColor = '#ff3366';
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.shadowBlur = 0; // [T7] reset immediately

            // [V5] Pre-computed glitch lines — no Math.random() in draw
            ctx.lineWidth = 2;
            obs.glitchLines.forEach(line => {
                ctx.globalAlpha = line.alpha;
                ctx.strokeStyle = '#fff';
                ctx.beginPath();
                ctx.moveTo(obs.x,              line.y1);
                ctx.lineTo(obs.x + obs.width,  line.y2);
                ctx.stroke();
            });
            ctx.globalAlpha = 1;
        } else {
            // Cleared — show a calm green passage
            ctx.fillStyle  = 'rgba(0, 80, 60, 0.5)';
            ctx.shadowBlur = 0;
            ctx.fillRect(obs.x - 8, 0, obs.width + 16, canvas.height);

            // Draw a thin glowing line to mark the passage
            ctx.strokeStyle = 'rgba(0, 255, 204, 0.3)';
            ctx.lineWidth   = 1;
            ctx.beginPath();
            ctx.moveTo(obs.x + obs.width / 2, 0);
            ctx.lineTo(obs.x + obs.width / 2, canvas.height);
            ctx.stroke();
        }
    });

    // Player — styled as a glowing chevron/diamond [V4 improvement]
    const px = player.x + player.width  / 2;
    const py = player.y + player.height / 2;
    const pr = player.width / 2;

    ctx.save();
    ctx.fillStyle   = player.color;
    ctx.shadowBlur  = 14;
    ctx.shadowColor = player.color;
    ctx.beginPath();
    ctx.moveTo(px,      py - pr);        // top
    ctx.lineTo(px + pr, py);             // right
    ctx.lineTo(px,      py + pr);        // bottom
    ctx.lineTo(px - pr, py);             // left
    ctx.closePath();
    ctx.fill();
    ctx.restore(); // [T7] guaranteed shadowBlur reset via restore

    // Particles [V7]
    drawParticles();
}

// ═══════════════════════════════════════════════════════════════════
// 14. GAME LOOP [B1] — clean RAF pattern
// ═══════════════════════════════════════════════════════════════════
function gameLoop() {
    update();
    draw();
    animFrameId = requestAnimationFrame(gameLoop);
}

// Game starts on button click — loop initialised in btn-start listener
