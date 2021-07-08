function Block(mgr, row, col, val) {
    this.mgr = mgr;
    this.row = row;
    this.col = col;
    this.val = val;
    this.locked = false;
}

Block.prototype.getElement = function () {
    var container = document.getElementById("grid-container");
    var row = container.children[this.row];
    var element = row.children[this.col];
    return element;
};

Block.prototype.unlock = function () {
    this.locked = false;
    this.getElement().classList.remove("new");
};

Block.prototype.paint = function () {
    var element = this.getElement();
    if (this.val === 0) {
        element.innerText = " ";
    } else {
        element.innerText = this.val.toString();
    }
    var flag = element.classList.contains("new");
    element.className = "grid-cell val-" + this.val.toString();
    if (flag) {
        element.className += " new";
    }
};

Block.prototype.mergeInto = function (row, col) {
    var target = this.mgr.getBlock(row, col);

    if (this.val === 0) {
        return false;
    }
    if (target.val === 0) {
        target.val = this.val;
        this.val = 0;
        return true;
    }
    if (this.val !== target.val) {
        return false;
    }
    if (this.locked || target.locked) {
        return false;
    }
    target.val += this.val;
    this.val = 0;
    this.mgr.score += target.val;
    target.locked = true;
    return true;
};

Block.prototype.up = function () {
    if (this.row !== 0) {
        return this.mergeInto(this.row - 1, this.col);
    }
    return false;
};

Block.prototype.down = function () {
    if (this.row !== 3) {
        return this.mergeInto(this.row + 1, this.col);
    }
    return false;
};

Block.prototype.left = function () {
    if (this.col !== 0) {
        return this.mergeInto(this.row, this.col - 1);
    }
    return false;
};

Block.prototype.right = function () {
    if (this.col !== 3) {
        return this.mergeInto(this.row, this.col + 1);
    }
    return false;
};

function Manager() {
    this.blocks = [];
    this.score = 0;
}

Manager.prototype.reset = function () {
    document.getElementById("status").innerText = "";
    this.hideAgain();
    this.blocks = [];
    this.score = 0;
};

Manager.prototype.start = function () {
    document.addEventListener("keydown", handler, false);
    for (let i = 0; i < 4; i++) {
        this.blocks[i] = [];
        for (let j = 0; j < 4; j++) {
            this.blocks[i][j] = new Block(this, i, j, 0);
        }
    }
    this.add(2);
    this.add(2);
    this.paint();
    this.showScore();
    this.unlock();
};

Manager.prototype.getEmpty = function () {
    var empty = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let block = this.blocks[i][j];
            if (block.val === 0) {
                empty.push(block);
            }
        }
    }
    return empty;
};

Manager.prototype.add = function (val) {
    if (!val) {
        val = (Math.floor(Math.random() * 2) + 1) * 2;
    }
    var empty = this.getEmpty();
    if (empty.length === 0) {
        return;
    }
    var num = Math.floor(Math.random() * empty.length);
    empty[num].val = val;
    empty[num].getElement().classList.add("new");
};

Manager.prototype.getBlock = function (row, col) {
    return this.blocks[row][col];
};

Manager.prototype.unlock = function () {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            this.blocks[i][j].unlock();
        }
    }
};

Manager.prototype.paint = function () {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            this.blocks[i][j].paint();
        }
    }
};

Manager.prototype.up = function () {
    var flag = false;
    for (let k = 0; k < 4; k++) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let block = this.blocks[i][j];
                flag = block.up() || flag;
            }
        }
    }
    return flag;
};

Manager.prototype.down = function () {
    var flag = false;
    for (let k = 0; k < 4; k++) {
        for (let i = 3; i >= 0; i--) {
            for (let j = 0; j < 4; j++) {
                let block = this.blocks[i][j];
                flag = block.down() || flag;
            }
        }
    }
    return flag;
};

Manager.prototype.left = function () {
    var flag = false;
    for (let k = 0; k < 4; k++) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let block = this.blocks[i][j];
                flag = block.left() || flag;
            }
        }
    }
    return flag;
};

Manager.prototype.right = function () {
    var flag = false;
    for (let k = 0; k < 4; k++) {
        for (let i = 0; i < 4; i++) {
            for (let j = 3; j >= 0; j--) {
                let block = this.blocks[i][j];
                flag = block.right() || flag;
            }
        }
    }
    return flag;
};

Manager.prototype._check = function (row, col) {
    var block = this.blocks[row][col];
    var pool = [];
    if (row !== 0) {
        pool.push(this.getBlock(row - 1, col));
    }
    if (row !== 3) {
        pool.push(this.getBlock(row + 1, col));
    }
    if (col !== 0) {
        pool.push(this.getBlock(row, col - 1));
    }
    if (col !== 3) {
        pool.push(this.getBlock(row, col + 1));
    }
    var ok = false;
    pool.forEach(function (neighbor) {
        ok = ok || neighbor.val === block.val;
    });
    return ok;
};

Manager.prototype.check = function () {
    var ok = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ok = ok || this._check(i, j);
            if (this.blocks[i][j].val === 2048) {
                return "win";
            }
        }
    }
    var empty = this.getEmpty();
    if (empty.length) {
        return true;
    }
    return ok;
};
Manager.prototype.showScore = function () {
    var element = document.getElementById("score");
    element.innerText = this.score;
};

Manager.prototype.over = function () {
    document.removeEventListener("keydown", handler, false);
    this.showAgain();
    document.getElementById("status").innerText = "Game Over";
};
Manager.prototype.win = function () {
    document.removeEventListener("keydown", handler, false);
    this.showAgain();
    document.getElementById("status").innerText = "You Win!";
};
Manager.prototype.showAgain = function () {
    var again = document.getElementById("again");
    again.style.display = "inherit";
};
Manager.prototype.hideAgain = function () {
    var again = document.getElementById("again");
    again.style.display = "none";
};

function handler(event) {
    var key = event.key;
    if (!key.startsWith("Arrow")) {
        return;
    }
    event.preventDefault();

    var flag;
    if (key === "ArrowUp") {
        flag = mgr.up();
    } else if (key === "ArrowDown") {
        flag = mgr.down();
    } else if (key === "ArrowLeft") {
        flag = mgr.left();
    } else if (key === "ArrowRight") {
        flag = mgr.right();
    }

    mgr.showScore();
    mgr.unlock();
    mgr.paint();
    if (!mgr.check()) {
        mgr.over();
        return;
    }
    if (mgr.check() === "win") {
        mgr.win();
        return;
    }
    if (flag) {
        mgr.add();
        mgr.paint();
        if (!mgr.check()) {
            mgr.over();
            return;
        }
    }
}

var mgr = new Manager();
mgr.start();

document.getElementById("again").addEventListener(
    "click",
    function (event) {
        mgr.reset();
        mgr.start();
    },
    false
);
