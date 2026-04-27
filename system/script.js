/**
 * THE SYNTAX SCANNER - CORE SYSTEM
 * Version: 2.1 (Level Progression + Progressive Complexity)
 */

// 1. FIREBASE INITIALIZATION
// firebaseConfig is loaded from firebase-config.js
let db, storage;
try {
    if (typeof firebaseConfig !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        console.log("Firebase Initialized.");
    } else {
        throw new Error("firebaseConfig not defined. Check firebase-config.js");
    }
} catch (e) {
    console.warn("Firebase running in Local Mode:", e.message);
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// 2. DATASETS (Progressive Complexity)
const datasets = {
    level1: [
        { text: '42', type: 'expression' },
        { text: '-7', type: 'expression' },
        { text: 'x', type: 'expression' },
        { text: 'y', type: 'expression' },
        { text: 'pi', type: 'expression' },
        { text: '3 = 3', type: 'sentence' },
        { text: 'x = 5', type: 'sentence' },
        { text: '10 < 2', type: 'sentence' },
        { text: 'y > 0', type: 'sentence' },
        { text: 'a = b', type: 'sentence' }
    ],
    level2: [
        { text: '2x + 1', type: 'expression' },
        { text: 'x^2 - 4', type: 'expression' },
        { text: 'sqrt(16)', type: 'expression' },
        { text: '(a + b) / 2', type: 'expression' },
        { text: '3(x - y)', type: 'expression' },
        { text: '2x + 1 = 7', type: 'sentence' },
        { text: 'x^2 - 4 = 0', type: 'sentence' },
        { text: 'a + b < 10', type: 'sentence' },
        { text: '3x = 15', type: 'sentence' },
        { text: 'sqrt(x) > 2', type: 'sentence' }
    ],
    level3: [
        { text: '(x^2 + 2x + 1) / (x + 1)', type: 'expression' },
        { text: 'abs(x - 5) + 3', type: 'expression' },
        { text: 'sin(theta) * cos(theta)', type: 'expression' },
        { text: 'log_2(8)', type: 'expression' },
        { text: 'sum(n, i=1, 10)', type: 'expression' },
        { text: 'x^2 + y^2 = r^2', type: 'sentence' },
        { text: 'a^2 + b^2 = c^2', type: 'sentence' },
        { text: '2x - 3 >= x + 5', type: 'sentence' },
        { text: 'e^(i * pi) = -1', type: 'sentence' },
        { text: 'abs(x) < 5', type: 'sentence' }
    ]
};

// 3. ENGINE STATE
let currentLevel = 1;
let obstaclesCleared = 0;
let totalObstaclesInLevel = 0;
let score = { correct: 0, incorrect: 0 };
let isScanning = false;
let currentObstacle = null;
let obstacles = [];
const player = { x: 50, y: 180, width: 32, height: 32, speed: 4, color: '#00ffcc' };
let keys = {};

// 4. LEVEL MANAGEMENT
function loadLevel(levelNum) {
    currentLevel = levelNum;
    obstaclesCleared = 0;
    player.x = 50;
    player.y = 180;
    
    // Scaling obstacles: level + 1, capped at 6 for screen space
    totalObstaclesInLevel = Math.min(levelNum + 1, 6);

    // Generate obstacles
    obstacles = [];
    const spacing = (canvas.width - 200) / totalObstaclesInLevel;
    for (let i = 0; i < totalObstaclesInLevel; i++) {
        obstacles.push({
            x: 180 + (i * spacing),
            y: 0,
            width: 30,
            height: canvas.height,
            solved: false,
            text: '',
            answer: ''
        });
    }

    // Update HUD
    document.getElementById('level-display').innerText = `LEVEL: ${currentLevel}`;
    updateProgressHUD();
    document.getElementById('transition-overlay').classList.add('hidden');
}

function updateProgressHUD() {
    document.getElementById('progress-display').innerText = `OBJECTIVES: ${obstaclesCleared} / ${totalObstaclesInLevel}`;
}

// 5. SCREEN RECORDING
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

const btnRecord = document.getElementById('btn-record');
const recordingStatus = document.getElementById('recording-status');

btnRecord.addEventListener('click', () => {
    if (!isRecording) startRecording();
    else stopRecording();
});

function startRecording() {
    recordedChunks = [];
    const stream = canvas.captureStream(30);
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = uploadRecording;
    mediaRecorder.start();
    isRecording = true;
    btnRecord.innerText = "STOP RECORDING";
    btnRecord.classList.add('recording');
    recordingStatus.classList.remove('hidden');
}

function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
    btnRecord.innerText = "START RECORDING";
    btnRecord.classList.remove('recording');
    recordingStatus.classList.add('hidden');
}

async function uploadRecording() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const filename = `recording_L${currentLevel}_${Date.now()}.webm`;
    if (storage) {
        const storageRef = storage.ref(`recordings/${filename}`);
        await storageRef.put(blob);
        alert("Video saved to Cloud Storage.");
    } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
    }
}

// 6. GAMEPLAY LOGIC
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function showScanner(obstacle) {
    isScanning = true;
    currentObstacle = obstacle;
    
    // Choose dataset based on level
    let currentDataset;
    if (currentLevel === 1) currentDataset = datasets.level1;
    else if (currentLevel === 2) currentDataset = datasets.level2;
    else if (currentLevel === 3) currentDataset = datasets.level3;
    else {
        // Master Dataset (Levels 4+)
        currentDataset = [...datasets.level1, ...datasets.level2, ...datasets.level3];
    }

    const item = currentDataset[Math.floor(Math.random() * currentDataset.length)];
    currentObstacle.text = item.text;
    currentObstacle.answer = item.type;
    document.getElementById('math-display').innerText = item.text;
    document.getElementById('scanner-overlay').classList.remove('hidden');
}

function handleChoice(choice) {
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackText = document.getElementById('feedback-text');
    feedbackOverlay.classList.remove('hidden');
    
    const isCorrect = choice === currentObstacle.answer;
    
    if (isCorrect) {
        score.correct++;
        feedbackText.innerText = "ENVIRONMENT RESTORED";
        feedbackText.style.color = "#00ffcc";
        feedbackOverlay.className = 'restore-flash';
        currentObstacle.solved = true;
        obstaclesCleared++;
        updateProgressHUD();
    } else {
        score.incorrect++;
        feedbackText.innerText = "CRITICAL LOGIC ERROR";
        feedbackText.style.color = "#ff3366";
        feedbackOverlay.className = 'glitch-flash';
    }

    if (db) {
        db.collection("telemetry").add({
            level: currentLevel,
            math: currentObstacle.text,
            choice: choice,
            correct: isCorrect,
            timestamp: firebase.firestore.Timestamp.now()
        });
    }

    setTimeout(() => {
        document.getElementById('scanner-overlay').classList.add('hidden');
        feedbackOverlay.classList.add('hidden');
        feedbackOverlay.className = 'hidden';
        isScanning = false;
        
        if (obstaclesCleared === totalObstaclesInLevel) {
            showTransition();
        }
        currentObstacle = null;
    }, 1000);
}

document.getElementById('btn-expression').addEventListener('click', () => handleChoice('expression'));
document.getElementById('btn-sentence').addEventListener('click', () => handleChoice('sentence'));

function showTransition() {
    const total = score.correct + score.incorrect;
    const accuracy = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    
    document.getElementById('accuracy-stat').innerText = accuracy;
    document.getElementById('error-stat').innerText = score.incorrect;
    
    const title = document.getElementById('transition-title');
    const btn = document.getElementById('btn-next');
    
    title.innerText = "LEVEL COMPLETE";
    btn.innerText = `PROCEED TO LEVEL ${currentLevel + 1}`;
    
    document.getElementById('transition-overlay').classList.remove('hidden');
}

document.getElementById('btn-next').addEventListener('click', () => {
    loadLevel(currentLevel + 1);
});

function update() {
    if (isScanning || !document.getElementById('transition-overlay').classList.contains('hidden')) return;
    if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
    if (keys['ArrowUp'] || keys['KeyW']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['KeyS']) player.y += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    obstacles.forEach(obs => {
        if (!obs.solved &&
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            player.x = obs.x - player.width - 2;
            showScanner(obs);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for(let j=0; j<canvas.height; j+=40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

    obstacles.forEach(obs => {
        if (!obs.solved) {
            ctx.fillStyle = '#ff3366'; ctx.shadowBlur = 15; ctx.shadowColor = '#ff3366';
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath();
            ctx.moveTo(obs.x, Math.random() * canvas.height); ctx.lineTo(obs.x + obs.width, Math.random() * canvas.height); ctx.stroke();
        } else {
            ctx.fillStyle = '#004433'; ctx.shadowBlur = 0; ctx.fillRect(obs.x - 10, 0, 50, canvas.height);
        }
    });

    ctx.fillStyle = player.color; ctx.shadowBlur = 10; ctx.shadowColor = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.shadowBlur = 0;

    requestAnimationFrame(() => { update(); draw(); });
}

loadLevel(1);
draw();
