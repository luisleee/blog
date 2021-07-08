var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var lastShot = Date.now();
var score = 0;
var started = false;

function gameOver() {
    clearInterval(intervalId);
    context.font = "60px Consolas";
    context.fillStyle = "White";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over", width / 2, height / 2);
    showAgain();
    body.removeEventListener("keydown", listener, false);
}

function drawScore() {
    context.font = "30px Consolas";
    context.fillStyle = "White";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " + score, 10, 10);
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

function Ship(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
}

function Bullet(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
}

function Asteroid(x, y, speedX, speedY, size) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.angle = 0;
    this.size = size;
}

Ship.prototype.forward = function () {
    this.x += 5 * Math.cos(this.angle);
    this.y += 5 * Math.sin(this.angle);
    if (this.x < 0) {
        this.x = width;
    }
    if (this.x > width) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = width;
    }
    if (this.y > width) {
        this.y = 0;
    }
};

Ship.prototype.backward = function () {
    this.x -= 5 * Math.cos(this.angle);
    this.y -= 5 * Math.sin(this.angle);
    if (this.x < 0) {
        this.x = width;
    }
    if (this.x > width) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = width;
    }
    if (this.y > width) {
        this.y = 0;
    }
};

Ship.prototype.left = function () {
    this.angle -= Math.PI / 12;
    if (this.angle < -Math.PI) {
        this.angle += Math.PI * 2;
    }
    if (this.angle > Math.PI) {
        this.angle -= Math.PI * 2;
    }
};

Ship.prototype.right = function () {
    this.angle += Math.PI / 12;
    if (this.angle < -Math.PI) {
        this.angle += Math.PI * 2;
    }
    if (this.angle > Math.PI) {
        this.angle -= Math.PI * 2;
    }
};

Ship.prototype.draw = function () {
    context.strokeStyle = "Lime";
    context.lineWidth = 4;

    var l = this.angle - Math.PI / 2;
    var r = this.angle + Math.PI / 2;

    context.beginPath();
    context.moveTo(
        this.x + 20 * Math.cos(this.angle),
        this.y + 20 * Math.sin(this.angle)
    );
    context.lineTo(this.x + 7 * Math.cos(r), this.y + 7 * Math.sin(r));
    context.moveTo(
        this.x + 20 * Math.cos(this.angle),
        this.y + 20 * Math.sin(this.angle)
    );
    context.lineTo(this.x + 7 * Math.cos(l), this.y + 7 * Math.sin(l));
    context.stroke();
};

Ship.prototype.shoot = function () {
    bullets.push(new Bullet(this.x, this.y, this.angle));
};

Bullet.prototype.move = function () {
    this.x += 20 * Math.cos(this.angle);
    this.y += 20 * Math.sin(this.angle);
};

Bullet.prototype.draw = function () {
    context.strokeStyle = "Yellow";
    context.lineWidth = 4;

    context.beginPath();
    context.moveTo(
        this.x - 5 * Math.cos(this.angle),
        this.y - 5 * Math.sin(this.angle)
    );
    context.lineTo(
        this.x + 5 * Math.cos(this.angle),
        this.y + 5 * Math.sin(this.angle)
    );
    context.stroke();
};

Asteroid.prototype.rotate = function () {
    this.angle += Math.PI / 96;
    if (this.angle < -Math.PI) {
        this.angle += Math.PI * 2;
    }
    if (this.angle > Math.PI) {
        this.angle -= Math.PI * 2;
    }
};

Asteroid.prototype.move = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) {
        this.x = width;
    }
    if (this.x > width) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = width;
    }
    if (this.y > width) {
        this.y = 0;
    }
};

Asteroid.prototype.draw = function () {
    context.strokeStyle = "#EE5721";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(
        this.x + this.size * Math.cos(this.angle),
        this.y + this.size * Math.sin(this.angle)
    );
    for (let i = 1; i <= 7; i++) {
        context.lineTo(
            this.x + this.size * Math.cos(this.angle + ((Math.PI * 2) / 7) * i),
            this.y + this.size * Math.sin(this.angle + ((Math.PI * 2) / 7) * i)
        );
    }
    context.stroke();
};

function blast(asteroid) {
    if (asteroid.size === 20) {
        return;
    }
    var a = new Asteroid(
        asteroid.x,
        asteroid.y,
        -asteroid.speedY,
        asteroid.speedX,

        asteroid.size / 2
    );
    var b = new Asteroid(
        asteroid.x,
        asteroid.y,
        asteroid.speedY,
        -asteroid.speedX,

        asteroid.size / 2
    );
    return [a, b];
}

function check() {
    asteroids.forEach(function (asteroid) {
        bullets.forEach(function (bullet) {
            var ax = asteroid.x;
            var ay = asteroid.y;
            var bx = bullet.x;
            var by = bullet.y;
            var dist = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
            if (dist <= asteroid.size) {
                asteroid.over = true;
                bullet.over = true;
                score += 100;
                var arr = blast(asteroid);
                if (arr) {
                    asteroids.push(arr[0], arr[1]);
                }
            }
        });
    });
    bullets.forEach(function (bullet) {
        if (
            bullet.x < -10 ||
            bullet.x > width + 10 ||
            bullet.y < -10 ||
            bullet.y > height + 10
        ) {
            bullet.over = true;
        }
    });
    asteroids = asteroids.filter(function (asteroid) {
        return !asteroid.over;
    });
    bullets = bullets.filter(function (bullet) {
        return !bullet.over;
    });
    asteroids.forEach(function (asteroid) {
        var ax = asteroid.x;
        var ay = asteroid.y;
        var bx = ship.x;
        var by = ship.y;
        var dist = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
        if (dist <= asteroid.size) {
            gameOver();
        }
    });
}

var body = document.getElementById("body");
function listener(event) {
    if (event.key === " ") {
        var time = Date.now();
        if (time - lastShot >= 500) {
            lastShot = time;
            ship.shoot();
        }
    } else if (event.key === "ArrowLeft") {
        ship.left();
    } else if (event.key === "ArrowRight") {
        ship.right();
    } else if (event.key === "ArrowUp") {
        ship.forward();
    } else if (event.key === "ArrowDown") {
        ship.backward();
    } else {
        return;
    }
    event.preventDefault();
}
body.addEventListener("keydown", listener, false);

var ship = new Ship(width / 2, height / 2, 0);
var asteroids = [];
var bullets = [];

function loop() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#333331";
    context.fillRect(0, 0, width, height);
    bullets.forEach(function (bullet) {
        bullet.move();
        bullet.draw();
    });
    asteroids.forEach(function (asteroid) {
        asteroid.move();
        asteroid.rotate();
        asteroid.draw();
    });
    ship.draw();
    drawScore();
    check();
}

var intervalId;
var asteroidInterval;

function appendAsteroid() {
    var l = Math.floor(Math.random() * 50);
    var r = Math.floor(Math.random() * 50 + width - 50);
    var t = Math.floor(Math.random() * 50);
    var b = Math.floor(Math.random() * 50 + height - 50);
    var k1 = Math.floor(Math.random() * 2);
    var k2 = Math.floor(Math.random() * 2);

    var x;
    var y;

    if (k1 === 1) {
        x = l;
    } else {
        x = r;
    }

    if (k2 === 1) {
        y = t;
    } else {
        y = b;
    }

    var vx = Math.floor(Math.random() * 10 - 5);
    var vy = Math.floor(Math.random() * 10 - 5);
    asteroids.push(new Asteroid(x, y, vx, vy, 80));
}

loop();
appendAsteroid();
appendAsteroid();
appendAsteroid();

function clickStart(event) {
    if (started) {
        return;
    }
    intervalId = setInterval(loop, 100);
    asteroidInterval = setInterval(appendAsteroid, 10000);
    started = true;
    hideInfo();
}
canvas.addEventListener("click", clickStart, false);

var again = document.getElementById("again");
function restart() {
    score = 0;
    started = false;
    lastShot = Date.now();
    bullets = [];
    asteroids = [];
    ship = new Ship(width / 2, height / 2, 0);

    showInfo();
    hideAgain();
    loop();
    appendAsteroid();
    appendAsteroid();
    appendAsteroid();
    body.addEventListener("keydown", listener, false);
}
again.addEventListener("click", restart, false);
