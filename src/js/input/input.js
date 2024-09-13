import { playChord, stopChord } from "../audio/audio1";
import { max, min } from "../basic/basic";
import { levelUp } from "../basic/levelup";
import { GameBoardInit } from "../basic/setup";

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
    // AUDIO
    playChord()
    if(GameBoardInit.UI.controler[0]&&GameBoardInit.UI.view[0]){
        GameBoardInit.UI.view[0].trigger = 1
    }
    
    if(GameBoardInit.UI.controler[1]&&GameBoardInit.UI.view[1]){
        GameBoardInit.UI.view[1].handleClick(x,y)
    }

    GameBoardInit.clickObject.forEach(rect => {
        if (rect.isMouseOver(x, y)) {
                //console.log("Action : ",rect.clickAction)

                if(rect.clickAction==1){
                    levelUp()
                }
                if(rect.clickAction==0){
                    GameBoardInit.RME([1,0,0])
                }
                if(rect.clickAction==2){
                    
                    if(GameBoardInit.sound){
                        // dont listen music > turn off
                        stopChord()
                        GameBoardInit.sound=0
                    }else{

                        // keepPlayChord()
                        // GameBoardInit.sound=1
                    }
                }
                if(rect.clickAction==3){
                    GameBoardInit.dragNumber = max(0,GameBoardInit.dragNumber-1)
                }
                if(rect.clickAction==4){
                    GameBoardInit.dragNumber = min(max(GameBoardInit.dragObject.length-GameBoardInit.dragCount,0),GameBoardInit.dragNumber+1)
                }
            
        }
    });

    GameBoardInit.dragObject.forEach(rect=>{
        if(rect.isDragging&&rect.isMouseOver(x,y)&&rect.canDrag){
            GameBoardInit.dragRect = rect;
        }
    })

    if(GameBoardInit.player){
        GameBoardInit.player.arrowHint.forEach(rect => {
            if (rect.isMouseOver(x, y) && rect.show) {
                //GameBoardInit.dragRect = rect;
                
                GameBoardInit.player.direction = rect.kind
                GameBoardInit.player.cd = rect.kind
                GameBoardInit.player.tap -= 1 
                GameBoardInit.tap = max(GameBoardInit.player.tap,0)
            }
        });
    }
}   

function handleMove(event) {
    event.preventDefault();
    const { x, y } = getMousePos(event);

    if (GameBoardInit.dragRect) {
        GameBoardInit.dragRect.drag(x, y);
    }

    if(GameBoardInit.UI.controler[1]&&GameBoardInit.UI.view[1]){
        GameBoardInit.UI.view[1].handleMouseMove(x,y)
    }

}

function handleEnd() {
    if (GameBoardInit.dragRect) {
        //GameBoardInit.dragRect.snapToGrid();
        GameBoardInit.dragRect.stopDragging();
        GameBoardInit.dragRect = null;
        //draw();
    }
}


export {handleEnd,handleMove,handleStart}