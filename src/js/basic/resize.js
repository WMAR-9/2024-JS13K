import { Letter, Particle, UIStartView } from "../objec/background"
import { DraggableItem, Menu } from "../objec/item"
import { LevelMap } from "./map"
import { GameBoardInit } from "./setup"

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
    
    for (let i = 0; i <= 2; i++) {
        GameBoardInit.clickObject.push(new DraggableItem(10 + grid*1.2 * i, 20, grid, grid, i!=2?i+4*i:20, i));
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

export { resize }