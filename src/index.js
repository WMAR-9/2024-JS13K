import { ctx,canvas, Loading, Img, roundedRect, canvasSave, canvasFillStyle, darkbule, blueColor, canvasRestore, PowerDraw, canvasDraw } from "./js/basic/setup.js";

import { Letter, Particle, UIStartView } from "./js/objec/background.js";
import { GameBoardInit } from "./js/basic/setup.js";
import { DraggableItem, Menu, Plug } from "./js/objec/item.js";
import { LevelMap } from "./js/basic/map.js";
import { TransitionEffect } from "./js/trans/transform.js";
import { max } from "./js/basic/basic.js";

const resize = () =>{

    GameBoardInit.mw = canvas.width = window.innerWidth
    GameBoardInit.mh = canvas.height = window.innerHeight
    GameBoardInit.background = new Particle(100)

    GameBoardInit.UI.view[0] = new UIStartView("13% LOW")
    GameBoardInit.UI.view[1] = new Menu(LevelMap)
    GameBoardInit.UI.view[2] = new Letter(" THANK YOU!!\n FOR PLAYING \n GOOD DAY !!\n WANT MORE??\n LETS DEV !!",5,1,.8)
    
    const curPos = GameBoardInit.CurPos
    const grid = GameBoardInit.grid

    GameBoardInit.clickObject=[]
    
    for (let i = 0; i < 2; i++) {
        GameBoardInit.clickObject.push(new DraggableItem(10 + grid*1.2 * i, 20, grid, grid, i+4*i, i));
    }

    const offsets = [
        { x: grid/10, y: -grid, w: grid*0.8, h: grid*0.8, id: 9, index: 3 },
        { x: grid*(GameBoardInit.dragCount+1) + grid/10, y: -grid, w: grid*0.8, h: grid*0.8, id: 8, index: 4 }
    ];
    
    offsets.forEach(offset => {
        GameBoardInit.clickObject.push(new DraggableItem(curPos.x + offset.x, curPos.y + offset.y, offset.w, offset.h, offset.id, offset.index));
    });


    GameBoardInit.dragObject.forEach(e=>{
        e.pos.setwh(curPos,grid).substract({x:0,y:grid*1.1})
        e.resize()
    })

    GameBoardInit.gameObject.forEach(e=>{
        e.resize()
    })

}

const levelUp = () =>{
    if(GameBoardInit.level>=LevelMap.length){
        GameBoardInit.RME([0,0,1])
        return;
    }

    GameBoardInit.gameObject = []
    GameBoardInit.dragObject = []
    GameBoardInit.clickObject = []

    let {x,y} = GameBoardInit.CurPos
    
    const grid = GameBoardInit.grid

    const curMap = LevelMap[GameBoardInit.level]
    // initial
    GameBoardInit.currentMap = JSON.parse(JSON.stringify(curMap.map))

    GameBoardInit.dragCount = GameBoardInit.mwl - 4
    GameBoardInit.dragMax = curMap.dg
    GameBoardInit.dragNumber = 0

    GameBoardInit.dragMax.forEach(e=>{
        const pal = new DraggableItem(x,y-grid*1.1,grid,grid,e)
        GameBoardInit.dragObject.push(pal)
    })

    let position = curMap.map.flatMap((row, i) => row.map((val, j) => val === 1 ? { i, j } : null)).find(p=>p);
    
    GameBoardInit.player = new Plug(position.j,position.i,GameBoardInit.grid,GameBoardInit.grid,curMap.tap)
    GameBoardInit.tap = curMap.tap

    GameBoardInit.gameObject.push(GameBoardInit.player)

    GameBoardInit.trans.st = new TransitionEffect(GameBoardInit.player,GameBoardInit.fadeIn)

    resize()
}

const transform= s =>{

    if(GameBoardInit.trans.s){
        GameBoardInit.trans.st.update()
        if(!GameBoardInit.trans.st.isRunning){
            GameBoardInit.trans.s = 0
        }
    }

    if(GameBoardInit.trans.e){
        GameBoardInit.trans.et.update()
        if(!GameBoardInit.trans.et.isRunning){
            levelUp()
        }
    }

}

const UIView = s =>{
   
    GameBoardInit.UI.view.forEach((e,i)=>{
        if(!GameBoardInit.UI.controler[i])return;
        e.update(s)
    })

}

const DrawMap =(map,grid,wl,hl)=>{

    let {x,y} = GameBoardInit.CurPos
    //console.log(curX,curY)
    canvasSave()

    canvasFillStyle(darkbule)
    
    roundedRect({x:x+10,y:y+10,w:wl*grid+10,h:hl*grid+10},1,0,20)

    canvasFillStyle(blueColor)
    
    roundedRect({x,y,w:wl*grid+10,h:hl*grid+10},1,1,20)
    


    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {

            if(map[j][i]){
                ctx.drawImage(Img.tiles[map[j][i]],i*grid+x,j*grid+y,grid,grid)
            }
        }
    }

    canvasRestore()
    //x: grid*(GameBoardInit.dragCount+1) + grid/10, y: -grid, w: grid*0.8, h: grid*0.8
    //PowerDraw(grid*(GameBoardInit.dragCount+1) + grid/10,-grid,grid*0.8,grid*0.8,1)

    GameBoardInit.gameObject.forEach(e=>{
        e.update(1)
        e.draw()
    })

    const showNumber = GameBoardInit.dragCount
    const start = GameBoardInit.dragObject.length> GameBoardInit.dragCount?GameBoardInit.dragNumber:0
    const end = start+showNumber

    GameBoardInit.dragObject.slice(start,end).forEach((e,i)=>{
        e.canDrag=1
        e.shift(i)
        e.draw()
    })

    GameBoardInit.clickObject.forEach(e=>{
        e.draw(1)
    })

    canvasDraw(Img.ATB[GameBoardInit.tap%10],{x: x+grid*(GameBoardInit.dragCount+3)+ grid/10,y:y-grid,w:grid*.8,h:grid*.8})
    canvasDraw(Img.ATB[GameBoardInit.tap/10|0],{x: x+grid*(GameBoardInit.dragCount+2)+ grid/10,y:y-grid,w:grid*.8,h:grid*.8})
}


const loop=()=>{

    ctx.clearRect(0,0, GameBoardInit.mw, GameBoardInit.mh)

    if(!GameBoardInit.UI.controler[0]){
        GameBoardInit.background.update(1)
    }

    // Map
    if(GameBoardInit.gameStart){
        UIView(1)
    }else{
        DrawMap(GameBoardInit.currentMap,GameBoardInit.grid,GameBoardInit.mwl,GameBoardInit.mhl)
        transform()
    }

    requestAnimationFrame(loop)
}

const setup=async ()=>{
    await Loading()
    levelUp()
    loop()
}

setup()



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
                if(rect.clickAction==3){
                    
                    GameBoardInit.dragNumber = Math.max(0,GameBoardInit.dragNumber-1)
                    // const showNumber = GameBoardInit.dragCount
                    // const start = GameBoardInit.dragNumber
                    // const end = start+showNumber
                    // //GameBoardInit.dragObject.slice(start,end)

                    // //console.log(GameBoardInit.dragNumber,GameBoardInit.dragObject.slice(start,end))
                }
                if(rect.clickAction==4){
                    GameBoardInit.dragNumber = Math.min(Math.max(GameBoardInit.dragObject.length-GameBoardInit.dragCount,0),GameBoardInit.dragNumber+1)
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





onresize=()=>resize()
// onmousedown = (event) => handleStart(event);
// onmousemove = (event) => handleMove(event);
// onmouseup = (event) => handleEnd(event);
// onmouseleave = (event) => handleEnd(event);


// ontouchstart = (event) => handleStart(event);
// ontouchmove = (event) => handleMove(event);
// ontouchend = (event) => handleEnd(event);
// ontouchcancel = (event) => handleEnd(event);


canvas.onmousedown = (event) => handleStart(event);
canvas.onmousemove = (event) => handleMove(event);
canvas.onmouseup = (event) => handleEnd(event);
canvas.onmouseleave = (event) => handleEnd(event);

canvas.ontouchstart = (event) => handleStart(event);
canvas.ontouchmove = (event) => handleMove(event);
canvas.ontouchend = (event) => handleEnd(event);
canvas.ontouchcancel = (event) => handleEnd(event);