const player = document.querySelector('.player');
const startScreen = document.querySelector('.start-screen');
const scoreDisplay = document.getElementById('score-value');
const gameContainer = document.querySelector('.game-container');
const topBoundary = gameContainer.offsetHeight * 0.1;
const bottomBoundary = gameContainer.offsetHeight * 1.0;
const gameOverScreen = document.querySelector('.game-over-screen');
const restartButton = document.getElementById('restart-button');

let gameActive = false;
let playerPositionY = Math.max(0, (gameContainer.offsetHeight - player.offsetHeight) / 2);
let playerSpeed = 5;
let score = 0;
let enemySpeed = 2;

function startGame() {
    startScreen.style.display = 'none';
    gameActive = true;
    player.style.bottom = playerPositionY + 'px';
    spawnEnemy();
    updateScore();
    gameLoop();
}

window.addEventListener('keydown', function(event) {
    if (!gameStarted && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        startGame();
    }
});

function updateScore() {
    if (gameActive) {
        score += 1;
        scoreDisplay.textContent = score;

        if (score % 2000 === 0) {
            playerSpeed += 2.5;
        }

        if (score % 100 === 0) {
            enemySpeed += 0.1;
        }

        setTimeout(updateScore, 100);
    }
}

function spawnEnemy() {
    if (gameActive) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.left = gameContainer.offsetWidth + 'px'; // Set initial position to the right end of the screen
        enemy.style.top = Math.floor(Math.random() * (gameContainer.offsetHeight - enemy.offsetHeight)) + 'px';
        gameContainer.appendChild(enemy);

        function moveEnemy() {
            if (gameActive) {
                const enemyLeft = parseFloat(enemy.style.left);
                if (enemyLeft > -enemy.offsetWidth) {
                    enemy.style.left = enemyLeft - enemySpeed + 'px';
                    requestAnimationFrame(moveEnemy);
                } else {
                    // Remove the enemy when it goes off the screen
                    enemy.remove();
                }
            }
        }

        moveEnemy();
    }
}

function updateScore() {
    if (gameActive) {
        score += 1;
        scoreDisplay.textContent = score;

        // Increase player speed every 5000 score
        if (score % 5000 === 0) {
            playerSpeed += 1;
        }

        // Increase enemy speed every 1000 score
        if (score % 1000 === 0) {
            enemySpeed += 1;
        }

        // Spawn enemies at every 45 score
        if (score % 45 === 0) {
            spawnEnemy();
            // Set a random interval between 1 to 4 seconds for spawning the next enemy
            const spawnInterval = Math.floor(Math.random() * (4000 - 1000) + 1000); // Random interval between 1000ms and 4000ms
            setTimeout(spawnEnemy, spawnInterval);
        }

        setTimeout(updateScore, 100);
    }
}

updateScore();





window.addEventListener('keydown', function(event) {
    if (!gameActive && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        startGame();
    }

    if (gameActive) {
        if (event.key === 'ArrowDown' && playerPositionY > topBoundary) {
            playerPositionY = Math.max(topBoundary, playerPositionY - playerSpeed);
        } else if (event.key === 'ArrowUp' && playerPositionY < bottomBoundary - player.offsetHeight) {
            playerPositionY = Math.min(bottomBoundary - player.offsetHeight, playerPositionY + playerSpeed);
        }
        player.style.bottom = playerPositionY + 'px';
    }
});

function checkCollision(player, enemy) {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    return !(
        playerRect.top > enemyRect.bottom ||
        playerRect.bottom < enemyRect.top ||
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right
    );
}

function gameLoop() {
    if (gameActive) {
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(function(enemy) {
            if (checkCollision(player, enemy)) {
                gameActive = false;
                gameOverScreen.style.display = 'block';
            }
        });

        requestAnimationFrame(gameLoop);
    }
}

gameLoop();

restartButton.addEventListener('click', function() {
    if (!gameActive) {
        gameActive = true;
        gameOverScreen.style.display = 'none';
        playerPositionY = Math.max(0, (gameContainer.offsetHeight - player.offsetHeight) / 2);
        player.style.bottom = playerPositionY + 'px';
        score = 0;
        scoreDisplay.textContent = score;
        playerSpeed = 5;
        enemySpeed = 2;
        spawnEnemy();
        updateScore();
        gameLoop();
        
        // Redirect to the desired URL
        window.location.href = '/index.html'; // Replace 'https://example.com' with your desired URL
    }
});
