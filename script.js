var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var sizeInput = document.getElementById("size");
var changeSize = document.getElementById("change-size");
var scoreLabel = document.getElementById("score");
var score = 0;
var size = 4;
var width = canvas.width / size - 6;
var cells = [];
var fontSize;
var loss = false;
var Cell = (function () {
    function Cell(row, coll) {
        this.row = row;
        this.coll = coll;
        this.value = 0;
        this.x = this.coll * width + 5 * (this.coll + 1);
        this.y = this.row * width + 5 * (this.row + 1);
    }
    return Cell;
}());
changeSize.onclick = function () {
    console.log("sizeInput.value", sizeInput.value);
    var newSize = +sizeInput.value;
    if (newSize > 2 && newSize < 20) {
        size = newSize;
        width = canvas.width / size - 6;
        canvasClear();
        startGame();
    }
    else {
        console.log("Value not set. Input ", sizeInput.value);
    }
};
function canvasClear() {
    ctx.clearRect(0, 0, 500, 500);
}
startGame();
function startGame() {
    creatCells();
    drawAllCells();
    pasteNewCell();
}
function creatCells() {
    for (var i = 0; i < size; i++) {
        cells[i] = [];
        for (var j = 0; j < size; j++) {
            cells[i][j] = new Cell(i, j);
        }
    }
}
function drawcCell(cell) {
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);
    switch (cell.value) {
        case 0:
            ctx.fillStyle = "#FF0000";
            break;
        case 2:
            ctx.fillStyle = "#FF0033";
            break;
        case 4:
            ctx.fillStyle = "#FF00A6";
            break;
        case 8:
            ctx.fillStyle = "#DE00FF";
            break;
        case 16:
            ctx.fillStyle = "#6F00FF";
            break;
        case 32:
            ctx.fillStyle = "#003CFF";
            break;
        case 64:
            ctx.fillStyle = "#00EBFF";
            break;
        case 128:
            ctx.fillStyle = "#00FF8D";
            break;
        case 256:
            ctx.fillStyle = "#00FF22";
            break;
        case 512:
            ctx.fillStyle = "#7CFF00";
            break;
        case 1024:
            ctx.fillStyle = "#F7FF00";
            break;
        case 2048:
            ctx.fillStyle = "#FF7C00";
            break;
        case 4096:
            ctx.fillStyle = "#FF2F00";
            break;
        default:
            ctx.fillStyle = "#FFFFFF";
            break;
    }
    ctx.fill();
    if (cell.value) {
        fontSize = width / 2;
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(cell.value.toString(), cell.x + width / 2, cell.y + width / 2);
    }
}
function drawAllCells() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            drawcCell(cells[i][j]);
        }
    }
}
function countFreeCells() {
    var countFree = 0;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (!cells[i][j].value)
                countFree++;
        }
    }
    return countFree;
}
function neighborSame() {
    return cells[0][0].value === cells[0][1].value;
}
function isGameOver() {
    return countFreeCells() == 0 && !neighborSame();
}
function pasteNewCell() {
    if (isGameOver()) {
        finishGame();
        return;
    }
    while (true) {
        var row = Math.floor(Math.random() * size);
        var coll = Math.floor(Math.random() * size);
        if (!cells[row][coll].value) {
            cells[row][coll].value = 2 * Math.ceil(Math.random());
            drawAllCells();
            return;
        }
    }
}
document.onkeydown = function (event) {
    if (!loss) {
        if (event.keyCode) {
            if (event.keyCode == 38 || event.keyCode == 87)
                moveUp();
            if (event.keyCode == 39 || event.keyCode == 68)
                moveRight();
            if (event.keyCode == 40 || event.keyCode == 83)
                moveDown();
            if (event.keyCode == 37 || event.keyCode == 65)
                moveLeft();
            scoreLabel.innerHTML = "Score: " + score;
        }
    }
};
function moveUp() {
    var change = false;
    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            if (cells[i][j].value) {
                var row = i;
                while (row > 0) {
                    if (cells[row - 1][j].value === 0) {
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        change = true;
                        row--;
                    }
                    else if (cells[row - 1][j].value == cells[row][j].value) {
                        cells[row - 1][j].value *= 2;
                        score += cells[row - 1][j].value;
                        cells[row][j].value = 0;
                        change = true;
                        break;
                    }
                    else
                        break;
                }
            }
        }
    }
    if (change)
        pasteNewCell();
}
function moveRight() {
    var change = false;
    for (var i = 0; i < size; i++) {
        for (var j = size - 2; j >= 0; j--) {
            if (cells[i][j].value) {
                var coll = j;
                while (coll + 1 < size) {
                    if (cells[i][coll + 1].value === 0) {
                        cells[i][coll + 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        change = true;
                        coll++;
                    }
                    else if (cells[i][coll].value == cells[i][coll + 1].value) {
                        cells[i][coll + 1].value *= 2;
                        score += cells[i][coll + 1].value;
                        cells[i][coll].value = 0;
                        change = true;
                        break;
                    }
                    else
                        break;
                }
            }
        }
    }
    pasteNewCell();
    if (change)
        pasteNewCell();
}
function moveDown() {
    for (var j = 0; j < size; j++) {
        for (var i = size - 2; i >= 0; i--) {
            if (cells[i][j].value) {
                var row = i;
                while (row + 1 < size) {
                    if (cells[row + 1][j].value === 0) {
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
                    }
                    else if (cells[row + 1][j].value == cells[row][j].value) {
                        cells[row + 1][j].value *= 2;
                        score += cells[row + 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    }
                    else
                        break;
                }
            }
        }
    }
    pasteNewCell();
}
function moveLeft() {
    for (var r_i = 0; r_i < size; r_i++) {
        for (var c_j = 1; c_j < size; c_j++) {
            if (cells[r_i][c_j].value) {
                var coll = c_j;
                while (coll - 1 >= 0) {
                    if (cells[r_i][coll - 1].value === 0) {
                        cells[r_i][coll - 1].value = cells[r_i][coll].value;
                        cells[r_i][coll].value = 0;
                        coll--;
                    }
                    else if (cells[r_i][coll].value == cells[r_i][coll - 1].value) {
                        cells[r_i][coll - 1].value *= 2;
                        score += cells[r_i][coll - 1].value;
                        cells[r_i][coll].value = 0;
                        break;
                    }
                    else
                        break;
                }
            }
        }
    }
    pasteNewCell();
}
function finishGame() {
    canvas.style.opacity = "0.5";
    loss = true;
}
