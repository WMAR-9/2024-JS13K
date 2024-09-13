import { DraggableItem, Plug } from "../objec/item";
import { TransitionEffect } from "../trans/transform";
import { LevelMap } from "./map";
import { resize } from "./resize";
import { GameBoardInit } from "./setup";

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

export { levelUp }