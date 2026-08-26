/* ============================================
   TETRIS POWERFUL EDITION - GAME LOGIC
   ============================================ */

// ===== KONFIGURASI =====
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// Warna blok dengan efek glow
const COLORS = {
    I: '#00f0ff',
    J: '#0055ff',
    L: '#ff9900',
    O: '#ffdd00',
    S: '#00ff66',
    T: '#aa44ff',
    Z: '#ff0044'
};

// Bentuk tetromino
const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

// Sistem poin Tetris (gaya modern)
const SCORE_TABLE = {
    single: 100,
    double: 300,
    triple: 500,
    tetris: 800
};

// ===== SCORE TRACKING =====
// Sistem penyimpanan skor (localStorage)
const SAVE_KEY = 'tetris-powerful-highscores';
const SAVE_STATE_KEY = 'tetris-powerful-state';

let score = 0;
let linesCleared = 0;
let level = 1;
let combo = 0;
let bestCombo = 0;
let tetrisCount = 0;
let piecesPlaced = 0;
let highScore = loadHighScore();
let scoreHistory = loadScoreHistory(); // Riwayat skor untuk leaderboard

function loadHighScore() {
    try {
        const data = JSON.parse(localStorage.getItem(SAVE_KEY) || '{"highScore":0,"history":[]}');
        return data.highScore || 0;
    } catch (e) {
        return 0;
    }
}

function loadScoreHistory() {
    try {
        const data = JSON.parse(localStorage.getItem(SAVE_KEY) || '{"highScore":0,"history":[]}');
        return data.history || [];
    } catch (e) {
        return [];
    }
}

function saveScores() {
    try {
        const data = {
            highScore: Math.max(highScore, score),
            history: scoreHistory.slice(0, 10)
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
        // Storage tidak tersedia, abaikan
    }
}

// Tambah skor berdasarkan jenis line clear
function addScore(event) {
    let points = 0;

    switch (event) {
        case 'single':
            points = SCORE_TABLE.single * level;
            break;
        case 'double':
            points = SCORE_TABLE.double * level;
            break;
        case 'triple':
            points = SCORE_TABLE.triple * level;
            break;
        case 'tetris':
            points = SCORE_TABLE.tetris * level;
            tetrisCount++;
            break;
    }

    // Bonus combo: setiap combo berturut-turut +50% poin
    if (combo > 0 && event !== 'none') {
        points += points * 0.5 * combo;
    }

    score += points;
    document.getElementById('score').textContent = score.toLocaleString('id-ID');
    updateHighScore();
    return points;
}

// Update high score real-time
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore.toLocaleString('id-ID');
        document.getElementById('highScore').style.color = '#ffdd00';
        document.getElementById('highScore').style.textShadow = '0 0 20px rgba(255, 221, 0, 0.8)';
    }
}

// Reset skor saat game baru
function resetScore() {
    score = 0;
    linesCleared = 0;
    level = 1;
    combo = 0;
    bestCombo = 0;
    tetrisCount = 0;
    piecesPlaced = 0;

    document.getElementById('score').textContent = '0';
    document.getElementById('lines').textContent = '0';
    document.getElementById('level').textContent = '1';
    document.getElementById('combo').textContent = '0';
    document.getElementById('highScore').textContent = highScore.toLocaleString('id-ID');
    document.getElementById('highScore').style.color = '';
    document.getElementById('highScore').style.textShadow = '';
}

// Simpan skor ke riwayat saat game over
function saveScoreToHistory() {
    if (score > 0) {
        const entry = {
            score: score,
            lines: linesCleared,
            level: level,
            date: new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        scoreHistory.push(entry);
        scoreHistory.sort((a, b) => b.score - a.score);
        saveScores();
    }
}

// ===== STATUS GAME =====
let board = [];
let currentPiece = null;
let nextPieces = [];
let holdPiece = null;
let canHold = true;
let paused = false;
let gameOver = false;
let gameStarted = false;

const blockSizeInCell = 1;

// Canvas
const boardCanvas = document.getElementById('boardCanvas');
const boardCtx = boardCanvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const holdCtx = holdCanvas.getContext('2d');
const nextCanvases = [
    document.getElementById('nextCanvas1'),
    document.getElementById('nextCanvas2'),
    document.getElementById('nextCanvas3')
].map(c => ({ canvas: c, ctx: c.getContext('2d') }));

const overlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayScore = document.getElementById('overlayScore');
const restartBtn = document.getElementById('restartBtn');

// Particle canvas untuk efek
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
let particles = [];

// ===== INISIALISASI BOARD =====
function createBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// ===== PIECE MANAGEMENT =====
function createPiece(type) {
    return {
        type: type,
        shape: SHAPES[type].map(row => [...row]),
        x: Math.floor((COLS - SHAPES[type][0].length) / 2),
        y: 0
    };
}

function getRandomPiece() {
    const types = Object.keys(SHAPES);
    // Bag system: ambil acak dari 7 piece
    const idx = Math.floor(Math.random() * types.length);
    return types[idx];
}

function initNextPieces() {
    nextPieces = [];
    for (let i = 0; i < 3; i++) {
        nextPieces.push(getRandomPiece());
    }
}

function spawnPiece() {
    const type = nextPieces.shift();
    nextPieces.push(getRandomPiece());
    currentPiece = createPiece(type);

    // Cek game over: jika piece tidak bisa diturunkan
    if (collides(currentPiece, currentPiece.x, currentPiece.y)) {
        endGame();
        return false;
    }
    return true;
}

// ===== KOLISI =====
function collides(piece, offsetX, offsetY) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const boardX = piece.x + x + offsetX;
                const boardY = piece.y + y + offsetY;

                if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                    return true;
                }
                if (boardY >= 0 && board[boardY][boardX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// ===== GERAKAN PIECE =====
function moveLeft() {
    if (!collides(currentPiece, -1, 0)) {
        currentPiece.x--;
        return true;
    }
    return false;
}

function moveRight() {
    if (!collides(currentPiece, 1, 0)) {
        currentPiece.x++;
        return true;
    }
    return false;
}

function rotatePiece() {
    const shape = currentPiece.shape;
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array.from({ length: cols }, (_, c) =>
        Array.from({ length: rows }, (_, r) => shape[rows - 1 - r][c])
    );

    // Simpan posisi lama untuk wall kick sederhana
    const oldX = currentPiece.x;
    currentPiece.shape = rotated;

    // Coba kick ke kiri/kanan jika bentrok
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
        if (!collides(currentPiece, kick, 0)) {
            currentPiece.x += kick;
            return true;
        }
    }

    // Rollback
    currentPiece.shape = shape;
    currentPiece.x = oldX;
    return false;
}

function softDrop() {
    if (!collides(currentPiece, 0, 1)) {
        currentPiece.y++;
        addScoreFromDrop(1);
        return true;
    }
    lockPiece();
    return false;
}

function hardDrop() {
    let dropDistance = 0;
    while (!collides(currentPiece, 0, 1)) {
        currentPiece.y++;
        dropDistance++;
    }
    addScoreFromDrop(dropDistance * 2);
    lockPiece();
    particles.push(...createDropParticles(currentPiece));
    return dropDistance;
}

function addScoreFromDrop(points) {
    score += points;
    document.getElementById('score').textContent = score.toLocaleString('id-ID');
}

// ===== LOCK PIECE & LINE CLEAR =====
function lockPiece() {
    const { shape, x, y } = currentPiece;
    const completedLines = [];

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const boardRow = y + row;
                const boardCol = x + col;
                if (boardRow < 0) {
                    endGame();
                    return;
                }
                board[boardRow][boardCol] = currentPiece.type;
            }
        }
    }

    // Cek baris penuh
    for (let row = 0; row < ROWS; row++) {
        if (board[row].every(cell => cell !== 0)) {
            completedLines.push(row);
        }
    }

    piecesPlaced++;
    canHold = true;

    if (completedLines.length > 0) {
        clearLines(completedLines);
        updateLevel();
    } else {
        combo = 0;
        document.getElementById('combo').textContent = '0';
    }

    if (!gameOver) {
        spawnPiece();
    }
}

function clearLines(lines) {
    // Efek partikel saat line clear
    const lineCount = lines.length;
    const event = lineCount === 1 ? 'single' :
                  lineCount === 2 ? 'double' :
                  lineCount === 3 ? 'triple' : 'tetris';

    // Tambah kombo
    combo++;
    if (combo > bestCombo) bestCombo = combo;

    // Score
    const points = addScore(event);
    linesCleared += lineCount;
    document.getElementById('lines').textContent = linesCleared;
    document.getElementById('combo').textContent = combo > 1 ? `x${combo}` : '0';

    // Feedback visual
    showComboFeedback(event, lineCount, points);
    triggerScreenFlash(lineCount);

    // Hapus baris
    for (const line of lines) {
        board.splice(line, 1);
        board.unshift(Array(COLS).fill(0));
    }
}

// ===== LEVEL SYSTEM =====
function updateLevel() {
    const newLevel = Math.floor(linesCleared / 10) + 1;
    if (newLevel !== level) {
        level = newLevel;
        document.getElementById('level').textContent = level;
        showLevelUp(level);
    }
    updateSpeedDisplay();
}

function updateSpeedDisplay() {
    const speedText = document.getElementById('speedText');
    const speedBar = document.getElementById('speedBar');

    const speedPct = Math.min(100, ((level - 1) / 15) * 100);
    speedBar.style.width = speedPct + '%';

    if (level <= 3) {
        speedText.textContent = 'Normal';
    } else if (level <= 6) {
        speedText.textContent = 'Fast';
    } else if (level <= 10) {
        speedText.textContent = 'Very Fast';
    } else if (level <= 15) {
        speedText.textContent = 'Insane';
    } else {
        speedText.textContent = 'IMPOSSIBLE!';
    }
}

// ===== HOLD PIECE =====
function holdCurrentPiece() {
    if (!canHold || gameOver || paused) return;

    if (holdPiece) {
        const swap = currentPiece;
        currentPiece = createPiece(holdPiece);
        currentPiece.x = Math.floor((COLS - SHAPES[currentPiece.type][0].length) / 2);
        currentPiece.y = 0;

        if (collides(currentPiece, 0, 0)) {
            currentPiece = swap;
            return;
        }

        holdPiece = swap.type;
    } else {
        holdPiece = currentPiece.type;
        if (!spawnPiece()) return;
    }

    canHold = false;
    drawHold();
}

// ===== GAME FLOW =====
function startGame() {
    resetScore();
    createBoard();
    particles = [];
    gameOver = false;
    paused = false;
    gameStarted = true;
    holdPiece = null;
    canHold = true;
    currentPiece = null;
    overlay.classList.add('hidden');

    initNextPieces();
    spawnPiece();
    draw();
    drawNext();
    drawHold();

    // Update referensi timers
    if (dropInterval) clearInterval(dropInterval);
    dropInterval = setInterval(() => {
        if (!paused && !gameOver) {
            if (!collides(currentPiece, 0, 1)) {
                currentPiece.y++;
            } else {
                lockPiece();
            }
            draw();
        }
    }, getDropInterval());
}

function endGame() {
    gameOver = true;
    if (dropInterval) clearInterval(dropInterval);

    saveScoreToHistory();
    updateHighScore();

    overlayTitle.textContent = 'GAME OVER';
    overlayScore.textContent = `Score: ${score.toLocaleString('id-ID')} | Lines: ${linesCleared} | Level: ${level}`;
    overlay.classList.remove('hidden');

    // Konfirmasi record baru
    if (score >= highScore && score > 0) {
        overlayTitle.textContent = '🏆 NEW RECORD!';
        overlayScore.textContent = `Amazing! ${score.toLocaleString('id-ID')} points!`;
    }
}

function togglePause() {
    if (!gameStarted || gameOver) return;
    paused = !paused;
    overlayTitle.textContent = 'PAUSED';
    overlayScore.textContent = `Score: ${score.toLocaleString('id-ID')} | Tekan P untuk lanjut`;
    if (paused) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function getDropInterval() {
    // Kecepatan bertambah seiring level
    const base = 1000;
    const min = 50;
    return Math.max(min, base * Math.pow(0.85, level - 1));
}

// ===== DRAWING =====
function draw() {
    // Board
    boardCtx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

    // Gambar sel-sel board
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = board[row][col];
            if (cell) {
                drawBlock(boardCtx, col, row, cell, false);
            }
        }
    }

    // Ghost piece (posisi jatuh)
    if (currentPiece && !gameOver) {
        let ghostY = 0;
        while (!collides(currentPiece, 0, ghostY + 1)) {
            ghostY++;
        }

        // Gambar ghost
        drawPiece(boardCtx, currentPiece.type, currentPiece.shape, currentPiece.x, currentPiece.y + ghostY, true);

        // Gambar piece aktif
        drawPiece(boardCtx, currentPiece.type, currentPiece.shape, currentPiece.x, currentPiece.y, false);
    }
}

function drawBlock(ctx, col, row, type, ghost) {
    const x = col * BLOCK_SIZE;
    const y = row * BLOCK_SIZE;
    const color = COLORS[type];

    if (ghost) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        ctx.globalAlpha = 1;
        return;
    }

    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    // Blok utama
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

    // Highlight atas-kiri
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, 4);
    ctx.fillRect(x + 1, y + 1, 4, BLOCK_SIZE - 2);

    // Shadow bawah-kanan
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + 1, y + BLOCK_SIZE - 5, BLOCK_SIZE - 2, 4);
    ctx.fillRect(x + BLOCK_SIZE - 5, y + 1, 4, BLOCK_SIZE - 2);
}

function drawPiece(ctx, type, shape, offsetX, offsetY, ghost) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const x = offsetX + col;
                const y = offsetY + row;
                if (y >= 0) {
                    drawBlock(ctx, x, y, type, ghost);
                }
            }
        }
    }
}

// Draw hold piece
function drawHold() {
    holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
    if (holdPiece) {
        const shape = SHAPES[holdPiece];
        const rows = shape.length;
        const cols = shape[0].length;
        const cellSize = 30;
        const offsetX = (holdCanvas.width - cols * cellSize) / 2;
        const offsetY = (holdCanvas.height - rows * cellSize) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (shape[row][col]) {
                    const x = offsetX + col * cellSize;
                    const y = offsetY + row * cellSize;
                    holdCtx.shadowColor = COLORS[holdPiece];
                    holdCtx.shadowBlur = 10;
                    holdCtx.fillStyle = COLORS[holdPiece];
                    holdCtx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                    holdCtx.shadowBlur = 0;
                    holdCtx.fillStyle = 'rgba(255,255,255,0.3)';
                    holdCtx.fillRect(x + 1, y + 1, cellSize - 2, 3);
                }
            }
        }
    }
}

// Draw next pieces
function drawNext() {
    nextCanvases.forEach((item, idx) => {
        const ctx = item.ctx;
        ctx.clearRect(0, 0, item.canvas.width, item.canvas.height);

        if (idx < nextPieces.length) {
            const type = nextPieces[idx];
            const shape = SHAPES[type];
            const rows = shape.length;
            const cols = shape[0].length;
            const cellSize = 30;
            const offsetX = (item.canvas.width - cols * cellSize) / 2;
            const offsetY = (item.canvas.height - rows * cellSize) / 2;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (shape[row][col]) {
                        const x = offsetX + col * cellSize;
                        const y = offsetY + row * cellSize;
                        ctx.shadowColor = COLORS[type];
                        ctx.shadowBlur = 10;
                        ctx.fillStyle = COLORS[type];
                        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = 'rgba(255,255,255,0.3)';
                        ctx.fillRect(x + 1, y + 1, cellSize - 2, 3);
                    }
                }
            }
        }
    });
}

// ===== UI FEEDBACK =====
function showComboFeedback(event, lineCount, points) {
    // Float text sederhana menggunakan overlay
    const labelMap = {
        single: 'SINGLE!',
        double: 'DOUBLE!',
        triple: 'TRIPLE!',
        tetris: 'TETRIS!'
    };

    overlayTitle.textContent = labelMap[event];
    overlayScore.textContent = `+${points.toLocaleString('id-ID')} points`;
    overlay.classList.remove('hidden');

    // Hilangkan overlay feedback setelah 1 detik
    setTimeout(() => {
        if (!paused && !gameOver) {
            overlay.classList.add('hidden');
        }
    }, 1000);
}

function showLevelUp(newLevel) {
    // Efek level up - panggil overlay
    const tempOverlayTitle = document.getElementById('overlayTitle');
    const tempOverlayScore = document.getElementById('overlayScore');
    if (gameOver || paused) return;
    tempOverlayTitle.textContent = `LEVEL ${newLevel}!`;
    tempOverlayScore.textContent = 'Faster!';
    overlay.classList.remove('hidden');
    setTimeout(() => {
        if (!paused && !gameOver) {
            overlay.classList.add('hidden');
        }
    }, 800);
}

function triggerScreenFlash(lineCount) {
    const colors = {
        1: 'rgba(255,255,255,0.1)',
        2: 'rgba(255,221,0,0.1)',
        3: 'rgba(255,0,170,0.1)',
        4: 'rgba(0,240,255,0.15)'
    };

    const boardContainer = document.querySelector('.board-container');
    const flashDiv = document.createElement('div');
    flashDiv.style.cssText = `
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: ${colors[lineCount] || colors[1]};
        pointer-events: none;
        z-index: 5;
        animation: flash 0.4s ease-out;
    `;
    boardContainer.appendChild(flashDiv);
    setTimeout(() => flashDiv.remove(), 400);
}

// ===== PARTICLE EFFECTS =====
function createDropParticles(piece) {
    const fx = [];
    const { shape, x, y, type } = piece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const px = (x + col) * BLOCK_SIZE + BLOCK_SIZE / 2;
                const py = (y + row) * BLOCK_SIZE + BLOCK_SIZE / 2;
                fx.push({
                    x: px,
                    y: py,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6 - 2,
                    life: 1,
                    decay: 0.02 + Math.random() * 0.02,
                    color: COLORS[type],
                    size: 3 + Math.random() * 4
                });
            }
        }
    }
    return fx;
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles = particles.filter(p => p.life > 0);
    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= p.decay;

        particleCtx.globalAlpha = p.life;
        particleCtx.fillStyle = p.color;
        particleCtx.shadowColor = p.color;
        particleCtx.shadowBlur = 8;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        particleCtx.fill();
    }
    particleCtx.globalAlpha = 1;
    particleCtx.shadowBlur = 0;

    requestAnimationFrame(animateParticles);
}

// ===== INIT PARTICLE CANVAS =====
function initParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    });
    animateParticles();
}

// ===== INPUT HANDLING =====
let dropInterval = null;
let lastMoveTime = 0;
let moveHoldDelay = 160;
let moveRepeatDelay = 80;

document.addEventListener('keydown', (e) => {
    if (!gameStarted || gameOver && e.key !== 'r') return;

    const now = Date.now();

    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            moveLeft();
            draw();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            moveRight();
            draw();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            e.preventDefault();
            if (!paused && !gameOver) {
                softDrop();
                draw();
            }
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
            e.preventDefault();
            if (!paused && !gameOver) {
                rotatePiece();
                draw();
            }
            break;
        case ' ':
            e.preventDefault();
            if (!paused && !gameOver) {
                hardDrop();
                draw();
                drawNext();
            }
            break;
        case 'c':
        case 'C':
            if (!paused && !gameOver) {
                holdCurrentPiece();
                draw();
            }
            break;
        case 'p':
        case 'P':
            togglePause();
            break;
        case 'r':
        case 'R':
            startGame();
            break;
    }
});

// Tombol restart
restartBtn.addEventListener('click', () => {
    startGame();
});

// ===== START =====
window.addEventListener('load', () => {
    initParticleCanvas();

    // Load game state
    document.getElementById('score').textContent = '0';
    document.getElementById('lines').textContent = '0';
    document.getElementById('level').textContent = '1';
    document.getElementById('combo').textContent = '0';
    document.getElementById('highScore').textContent = highScore.toLocaleString('id-ID');

    // Tampilkan menu awal
    overlayTitle.textContent = 'TETRIS';
    overlayScore.textContent = 'Tekan R untuk mulai';
    overlay.classList.remove('hidden');

    startGame();
});