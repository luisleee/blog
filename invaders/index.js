var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var borderWidth = 10;

var score = 0;
var started = false;
var speed = 1;
var shots = 0;
var hits = 0;
var lastShot = new Date();

var rows = 5;
var cols = 10;

function showAgain() {
    var again = document.getElementById("again");
    again.style.display = "inherit";
}

function hideAgain() {
    var again = document.getElementById("again");
    again.style.display = "none";
}

function showInfo() {
    var info = document.getElementById("info");
    info.style.display = "inherit";
}

function hideInfo() {
    var info = document.getElementById("info");
    info.style.display = "none";
}

// Draw the score in the top-left corner
function drawScore() {
    context.font = "20px Consolas";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " + score, borderWidth, borderWidth);
}

// Clear the interval and display Game Over text
function gameOver() {
    clearInterval(intervalId);
    context.font = "60px Consolas";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over", width / 2, height / 2);
    showAgain();
    body.removeEventListener("keydown", listener, false);
}

function drawBorder() {
    context.fillStyle = "Gray";
    context.fillRect(0, 0, width, borderWidth);
    context.fillRect(0, height - borderWidth, width, borderWidth);
    context.fillRect(0, 0, borderWidth, height);
    context.fillRect(width - borderWidth, 0, borderWidth, height);
}

function Bullet(x, y) {
    this.x = x;
    this.y = y;
}

function Invader(x, y, row, col) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.col = col;
    this.direction = "right";
}

function Gun(x) {
    this.x = x;
}

Bullet.prototype.draw = function () {
    context.fillStyle = "Gold";
    context.fillRect(this.x - 2, this.y - 5, 4, 10);
    context.fillStyle = "White";
    context.fillRect(this.x - 2, this.y - 5, 1, 1);
    context.fillRect(this.x + 1, this.y - 5, 1, 1);
    context.fillRect(this.x - 2, this.y + 4, 1, 1);
    context.fillRect(this.x + 1, this.y + 4, 1, 1);
};

Bullet.prototype.move = function () {
    this.y -= 10;
};

Invader.prototype.draw = function () {
    var x = this.x;
    var y = this.y;
    context.fillStyle = "Green";
    context.beginPath();
    context.moveTo(x - 5, y - 6);
    context.lineTo(x - 5, y - 4);
    context.lineTo(x - 7, y - 4);
    context.lineTo(x - 7, y - 2);
    context.lineTo(x - 9, y - 2);
    context.lineTo(x - 9, y);
    context.lineTo(x - 11, y);
    context.lineTo(x - 11, y + 6);
    context.lineTo(x - 9, y + 6);
    context.lineTo(x - 9, y + 2);
    context.lineTo(x - 7, y + 2);
    context.lineTo(x - 7, y + 6);
    context.lineTo(x - 5, y + 6);
    context.lineTo(x - 5, y + 2);
    context.lineTo(x + 5, y + 2);
    context.lineTo(x + 5, y + 6);
    context.lineTo(x + 7, y + 6);
    context.lineTo(x + 7, y + 2);
    context.lineTo(x + 9, y + 2);
    context.lineTo(x + 9, y + 6);
    context.lineTo(x + 11, y + 6);
    context.lineTo(x + 11, y);
    context.lineTo(x + 9, y);
    context.lineTo(x + 9, y - 2);
    context.lineTo(x + 7, y - 2);
    context.lineTo(x + 7, y - 4);
    context.lineTo(x + 5, y - 4);
    context.lineTo(x + 5, y - 6);
    context.lineTo(x + 3, y - 6);
    context.lineTo(x + 3, y - 4);
    context.lineTo(x - 3, y - 4);
    context.lineTo(x - 3, y - 6);
    context.lineTo(x - 5, y - 6);
    context.closePath();
    context.fill();
    context.fillRect(x - 7, y - 8, 2, 2);
    context.fillRect(x + 5, y - 8, 2, 2);
    context.fillRect(x - 5, y + 6, 4, 2);
    context.fillRect(x + 1, y + 6, 4, 2);
    context.fillStyle = "White";
    context.fillRect(x - 5, y - 2, 2, 2);
    context.fillRect(x + 3, y - 2, 2, 2);
};

Invader.prototype.move = function () {
    var limitL = borderWidth + 32 * (this.col - 1) + 16;
    var limitR = width - borderWidth - 32 * (cols - this.col + 1) + 16;
    if (this.x <= limitL) {
        this.direction = "right";
        this.y += 10;
    }
    if (this.x >= limitR) {
        this.direction = "left";
        this.y += 10;
    }

    if (this.direction === "right") {
        this.x += speed;
    }
    if (this.direction === "left") {
        this.x -= speed;
    }
};

Gun.prototype.draw = function () {
    context.fillStyle = "Blue";
    context.fillRect(this.x - 20, height - 20, 40, 20);
    context.fillRect(this.x - 5, height - 30, 10, 10);
    context.fillRect(this.x - 2, height - 35, 5, 5);
};

Gun.prototype.shoot = function () {
    bullets.push(new Bullet(this.x, height - 30));
    shots++;
};

Gun.prototype.left = function () {
    this.x -= 10;
};

Gun.prototype.right = function () {
    this.x += 10;
};

var bullets = [];
var invaders = [];

function newTerm() {
    speed += 1;
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            invaders.push(
                new Invader(
                    (width - 32 * cols) / 2 + 32 * j - 16,
                    100 + 20 * i - 10,
                    i,
                    j
                )
            );
        }
    }
}

function check() {
    bullets.forEach(function (bullet) {
        invaders.forEach(function (invader) {
            if (bullet.y < -10) {
                bullet.over = true;
            }
            if (
                bullet.x < invader.x + 11 &&
                bullet.x > invader.x - 11 &&
                bullet.y < invader.y + 8 &&
                bullet.y > invader.y - 8
            ) {
                bullet.over = true;
                invader.over = true;
                hits++;
                var acc = hits / shots;
                score += Math.floor(100 * acc) + 10;
            }
        });
    });
    bullets = bullets.filter(function (bullet) {
        return !bullet.over;
    });
    invaders = invaders.filter(function (invader) {
        return !invader.over;
    });
    if (invaders.length === 0) {
        newTerm();
    }
    invaders.forEach(function (invader) {
        if (invader.y > height - borderWidth - 50) {
            gameOver();
        }
    });
}

var gun;
gun = new Gun(width / 2);

newTerm();

function loop() {
    context.clearRect(0, 0, width, height);
    bullets.forEach(function (bullet) {
        bullet.move();
        bullet.draw();
    });
    gun.draw();
    invaders.forEach(function (invader) {
        invader.move();
        invader.draw();
    });
    check();
    drawScore();
    drawBorder();
}

var intervalId;

loop();
function clickStart(event) {
    if (started) {
        return;
    }
    intervalId = setInterval(loop, 100);
    started = true;
    hideInfo();
}
canvas.addEventListener("click", clickStart, false);

function listener(event) {
    if (event.key === " ") {
        var delta = new Date() - lastShot;
        if (delta >= 500) {
            lastShot = new Date();
            gun.shoot();
        }
    } else if (event.key === "ArrowLeft") {
        gun.left();
    } else if (event.key === "ArrowRight") {
        gun.right();
    } else {
        return;
    }
    event.preventDefault();
}

var body = document.getElementById("body");
body.addEventListener("keydown", listener, false);

var again = document.getElementById("again");
function restart() {
    score = 0;
    hits = 0;
    shots = 0;
    speed = 0;
    started = false;
    lastShot = new Date();
    bullets = [];
    invaders = [];
    newTerm();
    gun = new Gun(width / 2);

    loop();
    showInfo();
    hideAgain();
    body.addEventListener("keydown", listener, false);
}
again.addEventListener("click", restart, false);
