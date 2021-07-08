// Set up canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Get the width and height from the canvas element
var width = canvas.width;
var height = canvas.height;

// Work out the width and height in blocks
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// Set score to 0
var score = 0;
var started = false;
var intervalId = null;

// Draw the border
function drawBorder() {
    context.fillStyle = "Gray";
    context.fillRect(0, 0, width, blockSize);
    context.fillRect(0, height - blockSize, width, blockSize);
    context.fillRect(0, 0, blockSize, height);
    context.fillRect(width - blockSize, 0, blockSize, height);
}

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
    context.fillText("Score: " + score, blockSize, blockSize);
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

// Draw a circle (using the function from Chapter 14)
function circle(x, y, radius, fillCircle) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        context.fill();
    } else {
        context.stroke();
    }
}

// The Block constructor
function Block(col, row) {
    this.col = col;
    this.row = row;
}

// Draw a square at the block's location
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
};

// Draw a circle at the block's location
Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    context.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};

// Check if this block is in the same location as another block
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

// The Snake constructor
function Snake() {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];

    this.direction = "right";
    this.nextDirection = "right";
}

// Draw a square for each segment of the snake's body
Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        if (i % 2 === 0) {
            this.segments[i].drawSquare("Blue");
        } else {
            this.segments[i].drawSquare("Green");
        }
    }
};

// Create a new head and add it to the beginning of
// the snake to move the snake in its current direction
Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

// Check if the snake's new head has collided with the wall or itself
Snake.prototype.checkCollision = function (head) {
    var leftCollision = head.col === 0;
    var topCollision = head.row === 0;
    var rightCollision = head.col === widthInBlocks - 1;
    var bottomCollision = head.row === heightInBlocks - 1;

    var wallCollision =
        leftCollision || topCollision || rightCollision || bottomCollision;

    var selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
};

// Set the snake's next direction based on the keyboard
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }

    this.nextDirection = newDirection;
};

// The Apple constructor
function Apple() {
    this.position = new Block(10, 10);
}

// Draw a circle at the apple's location
Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

// Move the apple to a new random location
Apple.prototype.move = function () {
    var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
};

// Create the snake and apple objects
var snake = new Snake();
var apple = new Apple();

function loop() {
    context.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}

// Convert keycodes to directions
var directions = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
};

loop();
showInfo();

function clickStart(event) {
    if (started) {
        return;
    }
    // Pass an animation function to setInterval
    intervalId = setInterval(loop, 100);
    started = true;
    hideInfo();
}

canvas.addEventListener("click", clickStart, false);

// The keydown handler for handling direction key presses
var body = document.getElementById("body");
function listener(event) {
    var newDirection = directions[event.key];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
        event.preventDefault();
    }
}
body.addEventListener("keydown", listener, false);

var again = document.getElementById("again");
function restart(event) {
    score = 0;
    snake = new Snake();
    apple = new Apple();
    started = false;
    loop();
    showInfo();
    hideAgain();
    body.addEventListener("keydown", listener, false);
}
again.addEventListener("click", restart, false);
