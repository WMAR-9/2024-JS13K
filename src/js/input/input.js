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
        if (rect.isMouseOver(x, y)) {
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
        draggingRect = null;
        draw();
    }
}


canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('mouseleave', handleEnd);

canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('touchend', handleEnd);
canvas.addEventListener('touchcancel', handleEnd);