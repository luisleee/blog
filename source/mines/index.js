var blocks = [];
var handlers = [];
var first = true;
var timer;
var interval;

function Block(row, col, state, hasBomb) {
    this.row = row;
    this.col = col;
    this.state = state;
    this.hasBomb = hasBomb;
}

Block.prototype.getElement = function () {
    var container = document.getElementById("grid-container");
    var row = container.children[this.row];
    var element = row.children[this.col];
    return element;
};

function check() {
    var num = 0;
    var known = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let block = blocks[i][j];
            if (block.hasBomb && block.state === "flag") {
                num++;
            }
            if (!block.hasBomb && block.state === "known") {
                known++;
            }
            if (block.hasBomb && block.state === "known") {
                over();
                return;
            }
        }
    }
    if (num === 10 || known === 71) {
        win();
    }
}

function bind() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let block = blocks[i][j];
            function handler(event) {
                if (first) {
                    random(i, j);
                    timer = new Date();
                    interval = setInterval(setTime, 1000);
                    first = false;
                }
                if (event.button === 0) {
                    // Left
                    if (block.state === "unknow") {
                        flood(i, j);
                        check();
                    } else if (block.state === "known") {
                        clean(i, j);
                        check();
                    }
                } else if (event.button === 1) {
                    // Middle
                    if (block.state === "known") {
                        clean(i, j);
                        check();
                    }
                } else if (event.button === 2) {
                    if (block.state === "unknow") {
                        block.state = "flag";
                    } else if (block.state === "flag") {
                        block.state = "unknow";
                    }
                    paint(i, j);
                    check();
                }
            }
            block.getElement().addEventListener("mouseup", handler, false);
            handlers[i][j] = handler;
        }
    }
}

function unbind() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            blocks[i][j]
                .getElement()
                .removeEventListener("mouseup", handlers[i][j], false);
        }
    }
}

function restart() {
    hideAgain();
    blocks = [];
    first = true;
    document.getElementById("time").innerText = "00:00";
    document.getElementById("status").innerText = "";
    start();
}

function start() {
    for (let i = 0; i < 9; i++) {
        blocks[i] = [];
        handlers[i] = [];
        for (let j = 0; j < 9; j++) {
            blocks[i][j] = new Block(i, j, "unknow", false);
            blocks[i][j].getElement().className = "grid-cell";
            blocks[i][j].getElement().style.cssText = "";
            paint(i, j);
        }
    }
    bind();
}

function random(a, b) {
    var n = 0;
    while (n < 10) {
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        if (
            !blocks[row][col].hasBomb &&
            (Math.abs(row - a) > 1 || Math.abs(col - b) > 1)
        ) {
            blocks[row][col].hasBomb = true;
            n++;
        }
    }
}

function showAgain() {
    var again = document.getElementById("again");
    again.style.display = "inherit";
}

function hideAgain() {
    var again = document.getElementById("again");
    again.style.display = "none";
}

function win() {
    unbind();
    document.getElementById("status").innerText = "You Win!";
    showAgain();
    clearInterval(interval);
}

function over() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let block = blocks[i][j];
            if (block.hasBomb) {
                show(i, j);
            }
        }
    }
    unbind();
    document.getElementById("status").innerText = "Game Over";
    showAgain();
    clearInterval(interval);
}

function show(row, col) {
    var block = blocks[row][col];
    block.state = "known";
    paint(row, col);
}

function flood(row, col) {
    var vis = [];
    for (let i = 0; i < 9; i++) {
        vis[i] = [];
        for (let j = 0; j < 9; j++) {
            vis[i][j] = false;
        }
    }

    function _flood(row, col) {
        if (vis[row][col]) {
            return;
        }
        vis[row][col] = true;
        show(row, col);
        if (blocks[row][col].hasBomb) {
            return;
        }
        if (getVal(row, col) !== 0) {
            return;
        }
        if (row !== 0) {
            _flood(row - 1, col);
        }
        if (row !== 8) {
            _flood(row + 1, col);
        }
        if (col !== 0) {
            _flood(row, col - 1);
        }
        if (col !== 8) {
            _flood(row, col + 1);
        }
        if (row !== 0 && col !== 0) {
            _flood(row - 1, col - 1);
        }
        if (row !== 0 && col !== 8) {
            _flood(row - 1, col + 1);
        }
        if (row !== 8 && col !== 0) {
            _flood(row + 1, col - 1);
        }
        if (row !== 8 && col !== 8) {
            _flood(row + 1, col + 1);
        }
    }
    _flood(row, col);
}

function clean(row, col) {
    var val = getVal(row, col);
    if (val === 0) {
        return;
    }
    var flags = getFlags(row, col);
    var neighbors = getNeighbors(row, col);
    if (val === flags) {
        neighbors.forEach(function (neighbor) {
            if (neighbor.state === "unknow") {
                show(neighbor.row, neighbor.col);
                if (getVal(neighbor.row, neighbor.col) === 0) {
                    flood(neighbor.row, neighbor.col);
                }
            }
        });
    } else {
        var element = blocks[row][col].getElement();
        element.style.backgroundColor = "red";
        setTimeout(function () {
            element.style.backgroundColor = "inherit";
        }, 500);
    }
}

function paint(row, col) {
    var block = blocks[row][col];
    var element = block.getElement();
    var char = "";

    if (block.state === "unknow") {
        char = " ";
        element.classList.remove("flag");
        element.classList.add("unknow");
    } else if (block.state === "flag") {
        char = "⚑";
        element.classList.remove("unknow");
        element.classList.add("flag");
    } else if (block.state === "known") {
        element.classList.remove("flag");
        element.classList.remove("unknow");
        var val = getVal(row, col);
        if (block.hasBomb) {
            char = "❂";
            element.classList.add("bomb");
        } else if (val === 0) {
            char = " ";
            element.classList.add("empty");
        } else {
            char = val.toString();
            element.classList.add("color-" + char);
        }
    }

    element.innerText = char;
}

function getNeighbors(row, col) {
    var neighbors = [];
    if (row !== 0) {
        neighbors.push(blocks[row - 1][col]);
    }
    if (col !== 0) {
        neighbors.push(blocks[row][col - 1]);
    }
    if (row !== 8) {
        neighbors.push(blocks[row + 1][col]);
    }
    if (col !== 8) {
        neighbors.push(blocks[row][col + 1]);
    }
    if (row !== 0 && col !== 0) {
        neighbors.push(blocks[row - 1][col - 1]);
    }
    if (row !== 0 && col !== 8) {
        neighbors.push(blocks[row - 1][col + 1]);
    }
    if (row !== 8 && col !== 0) {
        neighbors.push(blocks[row + 1][col - 1]);
    }
    if (row !== 8 && col !== 8) {
        neighbors.push(blocks[row + 1][col + 1]);
    }
    return neighbors;
}

function getVal(row, col) {
    var neighbors = getNeighbors(row, col);
    var val = 0;

    neighbors.forEach(function (neighbor) {
        if (neighbor.hasBomb) {
            val++;
        }
    });

    return val;
}

function getFlags(row, col) {
    var neighbors = getNeighbors(row, col);
    var val = 0;

    neighbors.forEach(function (neighbor) {
        if (neighbor.state === "flag") {
            val++;
        }
    });

    return val;
}

var btn = document.getElementById("again");
btn.addEventListener("click", restart, false);

// Disable popup
document.getElementById("grid-container").addEventListener(
    "contextmenu",
    function (event) {
        event.preventDefault();
    },
    false
);

function setTime() {
    var time = new Date() - timer;
    var element = document.getElementById("time");

    var sec = Math.floor(time / 1000) % 60;
    var min = Math.floor(Math.floor(time / 1000) / 60);
    sec = sec < 10 ? "0" + sec.toString() : sec.toString();
    min = min < 10 ? "0" + min.toString() : min.toString();
    element.innerText = min + ":" + sec;
}

start();
