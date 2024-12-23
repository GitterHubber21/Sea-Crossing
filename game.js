const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables
let fish = { x: canvas.width / 2, y: canvas.height - 50, width: 20, height: 60, speed: 3.5 };
let fishNotInvincible = false;
let sharks = [];
let plants = [];
let fishDirection = { x: 0, y: 0 };
const sharkSpeed = 3.5;
const sharkRows = 6; // Number of rows of sharks
const sharksPerRow = 4; // Number of sharks in each row
const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
let gameOver = false;
let winLine = { x: Math.random() * (canvas.width - 10), width: 80, height: 10 }; // Initialize win line

// Color palette for plants
const plantColors = ['#34eb43', '#34c6eb', '#eb34e2', '#f5eb34', '#eb6e34'];

// Create animated sea plants
function createPlant(x, y, height, swaySpeed) {
    plants.push({ x, y, height, swayOffset: Math.random() * Math.PI * 2, swaySpeed, color: '#34eb43' });
}

// Create pixel-art sharks
function createSharks() {
    for (let i = 0; i < sharkRows; i++) {
        for (let j = 0; j < sharksPerRow; j++) {
            const shark = {
                x: Math.random() * canvas.width, // Random horizontal position
                y: (canvas.height / sharkRows) * i + 50, // Positioned in rows
                width: 40,
                height: 20,
                speed: -sharkSpeed * (Math.random() * 1.5 + 0.5), // Negative speed to move left
                verticalOffset: Math.random() * Math.PI * 2, // Random vertical starting offset
                verticalSpeed: Math.random() * 0.05 + 0.01, // Random vertical speed
            };
            sharks.push(shark);
        }
    }
}

// Draw the fish
// Draw the fish as a pixel-art clownfish
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

    const pixelSize = 5; // Size of each pixel

    fishPixels.forEach((row, rowIndex) => {
        row.forEach((pixel, colIndex) => {
            if (pixel === 0) return; // Transparent
            if (pixel === 1) ctx.fillStyle = '#FF6F00'; // Orange
            if (pixel === 2) ctx.fillStyle = '#000000'; // Black stripe
            if (pixel === 3) ctx.fillStyle = '#FFFFFF'; // White stripe
            if (pixel === 4) ctx.fillStyle = '#FF8C00'; // Shadow orange
            if (pixel === 5) ctx.fillStyle = '#FFD700'; // Highlight orange

            ctx.fillRect(
                fish.x + colIndex * pixelSize,
                fish.y + rowIndex * pixelSize,
                pixelSize,
                pixelSize
            );
        });
    });
}


// Draw the win line
function drawWinLine() {
    ctx.fillStyle = '#FFD700'; // Gold color for the win line
    ctx.fillRect(winLine.x, 0, winLine.width, winLine.height);
}

// Shark pixel art definition
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

    const pixelSize = 3; // Size of each pixel

    sharkPixels.forEach((row, rowIndex) => {
        row.forEach((pixel, colIndex) => {
            if (pixel === 0) return; // Empty space
            if (pixel === 1) ctx.fillStyle = '#4B89FF'; // Shark body color
            if (pixel === 2) ctx.fillStyle = '#FFFFFF'; // Shark belly color
            if (pixel === 3) ctx.fillStyle = '#ee2a2a'; // Shark mouth color
            if (pixel === 4) ctx.fillStyle = '#000000'; // Outline color

            ctx.fillRect(x + colIndex * pixelSize, y + rowIndex * pixelSize, pixelSize, pixelSize);
        });
    });
}

// Draw all sharks
function drawSharks() {
    sharks.forEach(shark => {
        drawShark(shark.x, shark.y, shark.direction);
    });
}

// Draw the plants
function drawPlants() {
    plants.forEach(plant => {
        const sway = Math.sin(Date.now() / 1000 * plant.swaySpeed + plant.swayOffset) * 5;
        ctx.fillStyle = plant.color;
        for (let i = 0; i < plant.height; i++) {
            ctx.fillRect(plant.x + sway, plant.y - i * 10, 10, 10); // Thicker and taller plants
        }
    });
}

// Move the sharks
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

// Check collisions
function checkCollisions() {
    sharks.forEach(shark => {
        if (
            fish.x < shark.x + 40 &&
            fish.x + fish.width > shark.x &&
            fish.y < shark.y + 40 &&
            fish.y + fish.height > shark.y&&
            fishNotInvincible
        ) {
            document.getElementById('endMenu2').style.display = 'flex';
            fishNotInvincible=false
            gameOver = true;
        }
    });

    // Check if the fish touches the win line
    if (
        fish.y <= winLine.height &&
        fish.x < winLine.x + winLine.width &&
        fish.x + fish.width > winLine.x
    ) {
        document.getElementById('endMenu').style.display = 'flex';
        fishNotInvincible=false
        gameOver = true;
    }
}

let stones = [];

// Create stone objects to fill the bottom of the screen
function createStones() {
    const stoneWidth = 40;
    const stoneHeight = 20;
    for (let x = 0; x < canvas.width; x += stoneWidth) {
        stones.push({ x, y: canvas.height - stoneHeight, width: stoneWidth, height: stoneHeight });
    }
}

// Draw all the stones at the bottom of the screen
function drawStones() {
    stones.forEach(stone => {
        ctx.fillStyle = '#A9A9A9'; // Grey color for stones
        ctx.fillRect(stone.x, stone.y, stone.width, stone.height);
    });
}

// Move the fish
function moveFish() {
    // Update fish position based on current direction
    fish.x += fish.speed * fishDirection.x;
    fish.y += fish.speed * fishDirection.y;

    // Prevent fish from moving outside the canvas boundaries
    fish.x = Math.max(0, Math.min(fish.x, canvas.width - fish.width));
    
    // Prevent fish from moving below the top of the stones
    const stoneTop = canvas.height - stones[0].height;
    fish.y = Math.max(0, Math.min(fish.y, stoneTop - fish.height));
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawPlants();
    drawSharks();
    drawFish();
    drawStones();
    drawWinLine();

    // Move elements
    moveSharks();
    moveFish();

    // Check collisions
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// Event listeners
window.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)&&fishNotInvincible) {
        keys[e.key] = true;

        // Change fish's direction based on key pressed
        if (e.key === 'ArrowLeft') fishDirection = { x: -1, y: 0 };
        if (e.key === 'ArrowRight') fishDirection = { x: 1, y: 0 };
        if (e.key === 'ArrowUp') fishDirection = { x: 0, y: -1 };
        if (e.key === 'ArrowDown') fishDirection = { x: 0, y: 1 };
        
    }
});

window.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Initialize game
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
    startMenu.style.display = 'none'; // Hide the start menu when the game starts
    fishNotInvincible=true
}
function restartGame() {
    endMenu.style.display = 'none'; // Hide the end menu
    
    resetGame(); // Reset game elements
    gameLoop(); // Start the game loop again
}
function restartGame2() {
    endMenu2.style.display = 'none'; // Hide the end menu
    
    resetGame(); // Reset game elements
    gameLoop(); // Start the game loop again
}
function resetGame() {
    // Reset fish properties
    fish = { x: canvas.width / 2, y: canvas.height - 60, width: 20, height: 60, speed: 4 };
    fishDirection = { x: 0, y: 0 };
    // Clear previous obstacles (sharks, stones, plants)
    sharks = [];
    stones = [];
    plants = [];
    
    // Create new obstacles for the restart
    createSharks();
    createStones();
    for (let i = 0; i < 50; i++) {
        createPlant(Math.random() * canvas.width, canvas.height - 10, Math.random() * 15 + 10, Math.random() * 2 + 1);
    }

    // Reset the game over flag
    gameOver = false;
    fishNotInvincible=true;

    // Show the start menu if needed (or reset to initial state)
    
    endMenu.style.display = 'none'; // Ensure the end menu is hidden
}

gameLoop();
