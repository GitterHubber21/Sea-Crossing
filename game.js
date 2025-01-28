const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fish = { x: canvas.width / 2, y: canvas.height - 50, width: 20, height: 60, speed: 3.5 };
let fishNotInvincible = false;
let sharks = [];
let plants = [];
let fishDirection = { x: 0, y: 0 };
const sharkSpeed = 3.5;
const sharkRows =4;
const sharksPerRow = 2;
let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
let gameOver = false;
let winLine = { x: Math.random() * (canvas.width - 10), width: 80, height: 10 };

const plantColors = ['#34eb43', '#34c6eb', '#eb34e2', '#f5eb34', '#eb6e34'];

let level = 0;
const sharksPerLevel = 2;

let levelDisplay = { x: -100, y: 50, width: 100, height: 50, speed: 2 };

function createPlant(x, y, height, swaySpeed) {
    plants.push({ x, y, height, swayOffset: Math.random() * Math.PI * 2, swaySpeed, color: '#34eb43' });
}

function createSharks() {
    for (let i = 0; i < sharkRows; i++) {
        for (let j = 0; j < sharksPerRow + level * sharksPerLevel; j++) {
            const shark = {
                x: Math.random() * canvas.width,
                y: (canvas.height / sharkRows) * i + 50,
                width: 40,
                height: 20,
                speed: -sharkSpeed * (Math.random() * 1.5 + 0.5),
                verticalOffset: Math.random() * Math.PI * 2,
                verticalSpeed: Math.random() * 0.05 + 0.01,
            };
            sharks.push(shark);
        }
    }
}

function drawFish() {
    const fishPixels = [
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 2, 1, 3, 3, 3, 1, 2, 0, 0],
        [0, 1, 3, 3, 4, 4, 4, 3, 3, 1, 0],
        [1, 3, 4, 4, 5, 4, 5, 4, 4, 3, 1],
        [1, 3, 4, 5, 5, 4, 5, 5, 4, 3, 1],
        [0, 1, 3, 4, 4, 4, 4, 4, 3, 1, 0],
        [0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        
    ];

    const pixelSize = 5;

    fishPixels.forEach((row, rowIndex) => {
        row.forEach((pixel, colIndex) => {
            if (pixel === 0) return;
            if (pixel === 1) ctx.fillStyle = '#FF6F00';
            if (pixel === 2) ctx.fillStyle = '#000000';
            if (pixel === 3) ctx.fillStyle = '#FFFFFF';
            if (pixel === 4) ctx.fillStyle = '#FF8C00';
            if (pixel === 5) ctx.fillStyle = '#FFD700';

            ctx.fillRect(
                fish.x + colIndex * pixelSize,
                fish.y + rowIndex * pixelSize,
                pixelSize,
                pixelSize
            );
        });
    });
}

function drawWinLine() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(winLine.x, 0, winLine.width, winLine.height);
}

function drawShark(x, y) {
    const sharkPixels = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4],
        [0, 0, 0, 0, 0, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 4],
        [0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 0, 0, 0, 4, 1, 1, 1, 4],
        [0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 4, 1, 1, 1, 4, 0],
        [0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 4, 0],
        [0, 4, 1, 1, 1, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
        [4, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0],
        [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0],
        [0, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0],
        [0, 0, 4, 2, 3, 2, 3, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 4, 0],
        [0, 0, 0, 4, 2, 3, 2, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 0, 0, 0, 0, 4, 1, 1, 4, 0],
        [0, 0, 0, 0, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0]
      ];
    const pixelSize = 3;

    sharkPixels.forEach((row, rowIndex) => {
        row.forEach((pixel, colIndex) => {
            if (pixel === 0) return;
            if (pixel === 1) ctx.fillStyle = '#4B89FF';
            if (pixel === 2) ctx.fillStyle = '#FFFFFF';
            if (pixel === 3) ctx.fillStyle = '#ee2a2a';
            if (pixel === 4) ctx.fillStyle = '#000000';

            ctx.fillRect(x + colIndex * pixelSize, y + rowIndex * pixelSize, pixelSize, pixelSize);
        });
    });
}

function drawSharks() {
    sharks.forEach(shark => {
        drawShark(shark.x, shark.y, shark.direction);
    });
}

function drawPlants() {
    plants.forEach(plant => {
        const sway = Math.sin(Date.now() / 1000 * plant.swaySpeed + plant.swayOffset) * 5;
        ctx.fillStyle = plant.color;
        for (let i = 0; i < plant.height; i++) {
            ctx.fillRect(plant.x + sway, plant.y - i * 10, 10, 10);
        }
    });
}

function moveSharks() {
    sharks.forEach(shark => {
        shark.x += shark.speed;
        shark.y += shark.verticalSpeed;

        if (shark.y <= 0 || shark.y + 75 >= canvas.height) {
            shark.verticalSpeed *= -1;
        }

        if (shark.x + shark.width < 0) {
            shark.x = canvas.width + shark.width;
            shark.y = Math.random() * (canvas.height - 100);
            shark.verticalSpeed = Math.random() * 1.5 - 0.75;
        }
    });
}

function drawLevelDisplay() {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText(`Level: ${level + 1}`, levelDisplay.x, levelDisplay.y);
}

function updateLevelDisplay() {
    levelDisplay.x += levelDisplay.speed;
    if (levelDisplay.x > canvas.width) {
        levelDisplay.x = -100;
    }
}

function resetLevelDisplay() {
    levelDisplay.x = -100;
}

function checkCollisions() {
    sharks.forEach(shark => {
        if (
            fish.x < shark.x + 40 &&
            fish.x + fish.width > shark.x &&
            fish.y < shark.y + 40 &&
            fish.y + fish.height > shark.y &&
            fishNotInvincible
        ) {
            document.getElementById('endMenu2').style.display = 'flex';
            fishNotInvincible = false;
            gameOver = true;
            level = 0;
        }
    });

    if (
        fish.y <= winLine.height &&
        fish.x < winLine.x + winLine.width &&
        fish.x + fish.width > winLine.x
    ) {
        level++;
        if (level < 5) {
            createSharks();
            resetGame();
            resetLevelDisplay();
        } else {
            document.getElementById('victoryMessage').style.display = 'flex';
            gameOver = true;
        }
    }
}

let stones = [];

function createStones() {
    const stoneWidth = 40;
    const stoneHeight = 20;
    for (let x = 0; x < canvas.width; x += stoneWidth) {
        stones.push({ x, y: canvas.height - stoneHeight, width: stoneWidth, height: stoneHeight });
    }
}

function drawStones() {
    stones.forEach(stone => {
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(stone.x, stone.y, stone.width, stone.height);
    });
}

function moveFish() {
    fish.x += fish.speed * fishDirection.x;
    fish.y += fish.speed * fishDirection.y;

    fish.x = Math.max(0, Math.min(fish.x, canvas.width - fish.width));

    const stoneTop = canvas.height - stones[0].height;
    fish.y = Math.max(0, Math.min(fish.y, stoneTop - fish.height));
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlants();
    drawSharks();
    drawFish();
    drawStones();
    drawWinLine();
    drawLevelDisplay();

    moveSharks();
    moveFish();
    updateLevelDisplay();

    checkCollisions();

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)&&fishNotInvincible) {
        keys[e.key] = true;

        if (e.key === 'ArrowLeft') fishDirection = { x: -1, y: 0 };
        if (e.key === 'ArrowRight') fishDirection = { x: 1, y: 0 };
        if (e.key === 'ArrowUp') fishDirection = { x: 0, y: -1 };
        if (e.key === 'ArrowDown') fishDirection = { x: 0, y: 1 };
        
    }
});

window.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

createSharks();
createStones();

for (let i = 0; i < 50; i++) {
    createPlant(
        Math.random() * canvas.width,
        canvas.height - 10,
        Math.random() * 15 + 10,
        Math.random() * 2 + 1
    );
}
function startGame() {
    startMenu.style.display = 'none';
    fishNotInvincible=true
}
function restartGame() {
    endMenu.style.display = 'none';
    
    resetGame();
    gameLoop();
}
function restartGame2() {
    endMenu2.style.display = 'none';
    
    resetGame();
    gameLoop();
}
function resetGame() {
    fish = { x: canvas.width / 2, y: canvas.height - 60, width: 20, height: 60, speed: 4 };
    fishDirection = { x: 0, y: 0 };
    sharks = [];
    stones = [];
    plants = [];
    
    createSharks();
    createStones();
    for (let i = 0; i < 50; i++) {
        createPlant(Math.random() * canvas.width, canvas.height - 10, Math.random() * 15 + 10, Math.random() * 2 + 1);
    }

    gameOver = false;
    fishNotInvincible = true;

    endMenu.style.display = 'none';
}

gameLoop();