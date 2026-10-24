
"use strict";

const canvas = document.getElementById("gameCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");

    const scoreEl = document.getElementById("score");
    const bestEl = document.getElementById("best");
    const levelEl = document.getElementById("level");

    const overlay = document.getElementById("overlay");
    const overlayTitle = document.getElementById("overlayTitle");
    const overlayText = document.getElementById("overlayText");

    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const statusEl = document.getElementById("status");

    const CELL = 20;
    const COLS = canvas.width / CELL;
    const ROWS = canvas.height / CELL;

    const obstacles = [
        { x: 8, y: 5 },
        { x: 9, y: 5 },
        { x: 20, y: 14 },
        { x: 21, y: 14 },
        { x: 13, y: 16 },
        { x: 14, y: 16 }
    ];

    let snake = [];

    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };

    let fruit = { x: 18, y: 8 };

    let score = 0;
    let best = loadBest();

    let running = false;
    let paused = false;
    let gameOver = false;

    let lastStep = 0;
    let accumulator = 0;
    let animationId = null;

    bestEl.textContent = best;

    drawBoard();

    // CARREGAR RECORDE

    function loadBest() {
        try {
            return Number(
                localStorage.getItem("serpentePixelBest")
            ) || 0;
        } catch (error) {
            return 0;
        }
    }

    // SALVAR RECORDE

    function saveBest() {
        try {
            localStorage.setItem(
                "serpentePixelBest",
                String(best)
            );
        } catch (error) {
            // O jogo continua funcionando sem salvar o recorde.
        }
    }

    // INICIAR O JOGO

    function startGame() {
        snake = [
            { x: 5, y: 10 },
            { x: 4, y: 10 },
            { x: 3, y: 10 }
        ];

        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };

        score = 0;

        running = true;
        paused = false;
        gameOver = false;

        accumulator = 0;
        lastStep = 0;

        placeFruit();
        updateStats();

        overlay.classList.add("hidden");

        pauseBtn.disabled = false;
        pauseBtn.textContent = "Pausar";

        statusEl.textContent =
            "Boa sorte! Colete as frutas.";

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }

        drawBoard();

        animationId = requestAnimationFrame(loop);
    }

    // COMPARAR POSIÇÕES

    function same(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    // POSICIONAR FRUTA

    function placeFruit() {
        const freeCells = [];

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const position = { x, y };

                const occupiedBySnake =
                    snake.some(part => same(part, position));

                const occupiedByObstacle =
                    obstacles.some(block => same(block, position));

                if (!occupiedBySnake && !occupiedByObstacle) {
                    freeCells.push(position);
                }
            }
        }

        if (freeCells.length === 0) {
            running = false;
            gameOver = true;

            overlayTitle.textContent = "Você venceu!";
            overlayText.textContent =
                "Você ocupou todo o tabuleiro!";

            startBtn.textContent = "Jogar novamente";
            overlay.classList.remove("hidden");

            pauseBtn.disabled = true;
            statusEl.textContent = "Parabéns! Você venceu.";

            return;
        }

        fruit = freeCells[
            Math.floor(Math.random() * freeCells.length)
        ];
    }

    // VELOCIDADE DA SERPENTE

    function speed() {
        return Math.max(
            65,
            145 - Math.floor(score / 50) * 12
        );
    }

    // ATUALIZAR PLACAR

    function updateStats() {
        scoreEl.textContent = score;
        bestEl.textContent = best;
        levelEl.textContent = 1 + Math.floor(score / 50);
    }

    // LOOP PRINCIPAL

    function loop(timestamp) {
        if (!running) {
            animationId = null;
            return;
        }

        if (!lastStep) {
            lastStep = timestamp;
        }

        const delta = timestamp - lastStep;
        lastStep = timestamp;

        if (!paused) {
            accumulator += delta;

            if (accumulator >= speed()) {
                step();
                accumulator = 0;
            }

            drawBoard();
        }

        if (running) {
            animationId = requestAnimationFrame(loop);
        } else {
            animationId = null;
        }
    }

    // MOVIMENTAR SERPENTE

    function step() {
        direction = nextDirection;

        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        const eating = same(head, fruit);

        const bodyToCheck = eating
            ? snake
            : snake.slice(0, -1);

        const hitWall =
            head.x < 0 ||
            head.x >= COLS ||
            head.y < 0 ||
            head.y >= ROWS;

        const hitSnake = bodyToCheck.some(
            part => same(part, head)
        );

        const hitObstacle = obstacles.some(
            block => same(block, head)
        );

        if (hitWall || hitSnake || hitObstacle) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (eating) {
            score += 10;

            if (score > best) {
                best = score;
                saveBest();
            }

            updateStats();
            placeFruit();

            if (running) {
                statusEl.textContent = "Muito bem! +10 pontos.";
            }
        } else {
            snake.pop();
        }
    }

    // FIM DE JOGO

    function endGame() {
        running = false;
        gameOver = true;
        paused = false;

        pauseBtn.disabled = true;

        overlayTitle.textContent = "Fim de jogo!";

        overlayText.textContent =
            `Você fez ${score} pontos. ` +
            "Tente novamente e supere seu recorde!";

        startBtn.textContent = "Jogar novamente";

        overlay.classList.remove("hidden");

        statusEl.textContent =
            "A partida terminou. Jogue novamente!";

        drawBoard();
    }

    // PAUSAR OU CONTINUAR

    function togglePause() {
        if (!running || gameOver) {
            return;
        }

        paused = !paused;

        pauseBtn.textContent = paused
            ? "Continuar"
            : "Pausar";

        statusEl.textContent = paused
            ? "Jogo pausado."
            : "Jogo retomado!";

        if (paused) {
            overlayTitle.textContent = "Pausa";
            overlayText.textContent =
                "Prepare sua próxima jogada.";

            startBtn.textContent = "Continuar";
            overlay.classList.remove("hidden");
        } else {
            overlay.classList.add("hidden");
            lastStep = 0;
        }
    }

    // DESENHAR RETÂNGULOS

    function roundedRect(
        x, y, width, height, radius, color
    ) {
        ctx.fillStyle = color;
        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            width,
            height,
            radius
        );

        ctx.fill();
    }

    // DESENHAR TABULEIRO

    function drawBoard() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // GRADE

        ctx.strokeStyle = "darkslategray";
        ctx.lineWidth = 1;

        for (let x = 0; x <= COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL, 0);
            ctx.lineTo(x * CELL, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL);
            ctx.lineTo(canvas.width, y * CELL);
            ctx.stroke();
        }

        // OBSTÁCULOS CINZENTOS

        obstacles.forEach(block => {
            roundedRect(
                block.x * CELL + 2,
                block.y * CELL + 2,
                CELL - 4,
                CELL - 4,
                4,
                "gray"
            );
        });

        // FRUTA

        const fx = fruit.x * CELL + CELL / 2;
        const fy = fruit.y * CELL + CELL / 2;

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(fx, fy + 1, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.ellipse(
            fx + 3, fy - 7, 4, 2, -0.6, 0, Math.PI * 2
        );
        ctx.fill();

        // CORPO DA SERPENTE

        snake.forEach((part, index) => {
            const inset = index === 0 ? 1 : 2;

            roundedRect(
                part.x * CELL + inset,
                part.y * CELL + inset,
                CELL - inset * 2,
                CELL - inset * 2,
                5,
                index === 0 ? "lightgreen" : "limegreen"
            );
        });

        // OLHOS

        if (snake.length > 0) {
            const head = snake[0];

            ctx.fillStyle = "black";

            const eyeSize = 2.5;

            if (direction.x !== 0) {
                ctx.beginPath();

                ctx.arc(
                    head.x * CELL + CELL / 2 + direction.x * 4,
                    head.y * CELL + 6,
                    eyeSize,
                    0,
                    Math.PI * 2
                );

                ctx.arc(
                    head.x * CELL + CELL / 2 + direction.x * 4,
                    head.y * CELL + 14,
                    eyeSize,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            } else {
                ctx.beginPath();

                ctx.arc(
                    head.x * CELL + 6,
                    head.y * CELL + CELL / 2 + direction.y * 4,
                    eyeSize,
                    0,
                    Math.PI * 2
                );

                ctx.arc(
                    head.x * CELL + 14,
                    head.y * CELL + CELL / 2 + direction.y * 4,
                    eyeSize,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        }
    }

    // CONTROLES DE MOVIMENTAÇÃO

    function changeDirection(key) {
        const keys = {
            ArrowUp: { x: 0, y: -1 },
            w: { x: 0, y: -1 },

            ArrowDown: { x: 0, y: 1 },
            s: { x: 0, y: 1 },

            ArrowLeft: { x: -1, y: 0 },
            a: { x: -1, y: 0 },

            ArrowRight: { x: 1, y: 0 },
            d: { x: 1, y: 0 }
        };

        const proposed = keys[key];

        if (!proposed || !running || paused) {
            return;
        }

        if (
            proposed.x === -direction.x &&
            proposed.y === -direction.y
        ) {
            return;
        }

        nextDirection = proposed;
    }

    // EVENTOS DO TECLADO

    document.addEventListener("keydown", event => {
        const key = event.key.length === 1
            ? event.key.toLowerCase()
            : event.key;

        if (
            [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                " "
            ].includes(event.key)
        ) {
            event.preventDefault();
        }

        if (event.key === " ") {
            togglePause();
            return;
        }

        changeDirection(key);
    });

    // BOTÃO INICIAR

    startBtn.addEventListener("click", () => {
        if (paused && running) {
            togglePause();
        } else {
            startGame();
        }
    });

    // BOTÃO PAUSAR

    pauseBtn.addEventListener("click", togglePause);
}
