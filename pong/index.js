var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var pad = 50;

var scoreL = 0;
var scoreR = 0;

function Paddle(x, y) {
    this.x = x;
    this.y = y;
}

Paddle.prototype.draw = function () {
    context.fillStyle = "Blue";
    context.fillRect(this.x - 5, this.y - 25, 10, 50);
};

Paddle.prototype.up = function () {
    this.y -= 20;
    if (this.y - 25 < 0) {
        this.y = 25;
    }
};

Paddle.prototype.down = function () {
    this.y += 20;
    if (this.y + 25 > height) {
        this.y = height - 25;
    }
};

function Ball(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
}

Ball.prototype.reset = function () {
    this.x = width / 2;
    this.y = height / 2;
    this.vx = Math.random() * 5 + 5;
    this.vy = Math.random() * 5 + 5;
};

Ball.prototype.cls = function () {
    this.x = width / 2;
    this.y = height / 2;
    this.vx = 0;
    this.vy = 0;
};

Ball.prototype.draw = function () {
    context.fillStyle = "Green";
    context.beginPath();
    context.arc(this.x, this.y, 5, 0, Math.PI * 2);
    context.closePath();
    context.fill();
};

Ball.prototype.move = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < 0) {
        this.y = 0;
        this.vy = -this.vy;
    }
    if (this.y > height) {
        this.y = height;
        this.vy = -this.vy;
    }
    var vx = this.vx;
    if (this.x > pad - 5 && this.x < pad - vx) {
        let y = paddleL.y;
        if (this.y < y + 25 && this.y > y - 25) {
            this.x = pad - vx;
            this.vx = -this.vx;
        }
    }
    if (this.x > width - pad - vx && this.x < width - pad + 5) {
        let y = paddleR.y;
        if (this.y < y + 25 && this.y > y - 25) {
            this.x = width - pad - vx;
            this.vx = -this.vx;
        }
    }
};

var paddleL = new Paddle(pad, height / 2);
var paddleR = new Paddle(width - pad, height / 2);
var ball = new Ball(width / 2, height / 2, 0, 0);
ball.reset();

function check() {
    if (ball.x < 0) {
        ball.cls();
        scoreR++;
        setTimeout(function () {
            ball.reset();
        }, 300);
    }
    if (ball.x > width) {
        ball.cls();
        scoreL++;
        setTimeout(function () {
            ball.reset();
        }, 300);
    }
}

function drawScore() {
    context.textAlign = "start";
    context.textBaseline = "top";
    context.font = "20px Arial";
    context.fillStyle = "Black";
    context.fillText("L:" + scoreL, 10, 10, 100);
    context.textAlign = "end";
    context.fillText("R:" + scoreR, width - 10, 10, 100);
}

var intervalId = setInterval(function () {
    context.clearRect(0, 0, width, height);
    context.strokeRect(0, 0, width, height);
    ball.draw();
    ball.move();
    paddleL.draw();
    paddleR.draw();
    check();
    drawScore();
}, 100);

document.getElementById("body").addEventListener(
    "keydown",
    function (event) {
        var key = event.key;
        if (key === "w") {
            paddleL.up();
        } else if (key === "s") {
            paddleL.down();
        } else if (key === "ArrowUp") {
            paddleR.up();
        } else if (key === "ArrowDown") {
            paddleR.down();
        } else {
            return;
        }
        event.preventDefault();
    },
    false
);
