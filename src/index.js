import { ctx,canvas, Loading, Img, roundedRect, canvasSave, canvasFillStyle, darkbule, blueColor, canvasRestore, PowerDraw, canvasDraw } from "./js/basic/setup.js";
import { Letter, Particle, UIStartView } from "./js/objec/background.js";
import { GameBoardInit } from "./js/basic/setup.js";
import { DraggableItem, Menu, Plug } from "./js/objec/item.js";
import { LevelMap } from "./js/basic/map.js";
import { TransitionEffect } from "./js/trans/transform.js";
import { max } from "./js/basic/basic.js";

import { handleEnd, handleMove, handleStart } from "./js/input/input.js";
import { levelUp } from "./js/basic/levelup.js";
import { resize } from "./js/basic/resize.js";




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


onresize=()=>resize()
canvas.onmousedown = (event) => handleEnd(event);
canvas.onmousemove = (event) => handleMove(event);
canvas.onmouseup = (event) => handleEnd(event);
canvas.onmouseleave = (event) => handleEnd(event);

canvas.ontouchstart = (event) => handleStart(event);
canvas.ontouchmove = (event) => handleMove(event);
canvas.ontouchend = (event) => handleEnd(event);
canvas.ontouchcancel = (event) => handleEnd(event);