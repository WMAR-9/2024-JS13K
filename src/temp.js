const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 50; // 每個地圖單元的大小

const level = [
    "WWWWWW",
    "W....W",
    "W.PB.W",
    "W..BGW",
    "W....W",
    "WWWWWW"
];

class DraggableRect {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.tempColor = this.color
        this.isDragging = false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isMouseOver(mouseX, mouseY) {
        return mouseX > this.x && mouseX < this.x + this.width &&
               mouseY > this.y && mouseY < this.y + this.height;
    }

    startDragging() {
        this.isDragging = true;
    }

    stopDragging() {
        this.isDragging = false;
    }

    drag(mouseX, mouseY) {
        if (this.isDragging) {
            this.x = mouseX - this.width / 2;
            this.y = mouseY - this.height / 2;
        }
    }

    snapToGrid() {
        const gridX = Math.floor(this.x / TILE_SIZE);
        const gridY = Math.floor(this.y / TILE_SIZE);

        // 定义误差容忍范围 (例如：10 像素)
        const tolerance = 50;

        const centerX = gridX * TILE_SIZE + TILE_SIZE / 2;
        const centerY = gridY * TILE_SIZE + TILE_SIZE / 2;

        // 允许在 tolerance 范围内的吸附（含正负范围）
        if (gridX >= 0 && gridX < level[0].length && gridY >= 0 && gridY < level.length) {
            if (this.x + this.width / 2 >= centerX - tolerance && this.x + this.width / 2 <= centerX + tolerance) {
                this.x = gridX * TILE_SIZE;
            }

            if (this.y + this.height / 2 >= centerY - tolerance && this.y + this.height / 2 <= centerY + tolerance) {
                this.y = gridY * TILE_SIZE;
            }
        } else {
            // 如果物体超出地图边界，将其限制在地图内
            this.x = Math.max(0, Math.min(this.x, (level[0].length - 1) * TILE_SIZE));
            this.y = Math.max(0, Math.min(this.y, (level.length - 1) * TILE_SIZE));
        }
    }
}

// 初始化一些可拖曳的矩形
const rects = [
    new DraggableRect(300, 300, TILE_SIZE, TILE_SIZE, 'red'), // 模擬一個箱子
    new DraggableRect(200, 200, TILE_SIZE, TILE_SIZE, 'blue'), // 模擬一個玩家
];

// 繪製地圖
function drawMap() {
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            switch (level[y][x]) {
                case 'W':
                    ctx.fillStyle = 'gray';
                    break;
                case '.':
                    ctx.fillStyle = 'white';
                    break;
                case 'P':
                    ctx.fillStyle = 'blue';
                    break;
                case 'B':
                    ctx.fillStyle = 'red';
                    break;
                case 'G':
                    ctx.fillStyle = 'yellow';
                    break;
            }
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

// 繪製所有矩形
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    rects.forEach(rect => rect.draw(ctx));
}

// 追蹤滑鼠或觸摸狀態
let draggingRect = null;

function getMousePos(event) {
    // 處理滑鼠事件
    if (event.clientX && event.clientY) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }

    // 處理觸摸事件
    if (event.touches && event.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }

    return { x: 0, y: 0 };
}

function handleStart(event) {
    event.preventDefault();
    const { x, y } = getMousePos(event);

    rects.forEach(rect => {
        if (rect.isMouseOver(x, y)&&rect.canDragging) {
            rect.startDragging();
            draggingRect = rect;
        }
    });
}

function handleMove(event) {
    event.preventDefault();
    const { x, y } = getMousePos(event);

    if (draggingRect) {
        draggingRect.drag(x, y);
        draw();
    }
}

function handleEnd() {
    if (draggingRect) {
        draggingRect.snapToGrid();
        draggingRect.stopDragging();
        draggingRect.color = draggingRect.tempColor
        draggingRect = null;
        draw();
    }
}

// 註冊滑鼠和觸摸事件
canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('mouseleave', handleEnd);

canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('touchend', handleEnd);
canvas.addEventListener('touchcancel', handleEnd);

// 初始化畫布
draw();