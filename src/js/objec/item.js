import { play } from "../audio/audio1.js";
import {  floor, localSet, max, min, randIntBetween } from "../basic/basic.js";
import { LevelMap } from "../basic/map.js";
import { ctx,GameBoardInit, Img, canvasDraw,canvasSave,canvasRestore,canvasAlpha,canvasFillStyle,roundedRect, blueColor, darkbule } from "../basic/setup.js";
import { Timer } from "../basic/timer.js";
import { TransitionEffect } from "../trans/transform.js";
import { Vector } from "./vector.js";

class Item{
    constructor(x,y,w,h,kind,dragBtn=0){

        this.npos = new Vector(x,y,w,h)
        this.pos = this.npos.clone()
        this.spos = this.pos.clone()
        this.prevpos = this.pos.clone()
        
        // direction
        this.dtimer = new Timer(0,1,.05,1)
        this.pd = 8
        this.cd = 7

        this.kind = kind
        
        // input

        this.isDragging = dragBtn

        this.timer = new Timer(0,1,.1)

        // the size of the map :: const GameBoardInit.
        this.mapLength = GameBoardInit.maxLgth
        
        // temp color
        const colArr = ["#000","#0f0","#f00","#00f","#0ff","#f0f","#fff","#f5f"]
        this.color = colArr[kind]
 
    }
    update(s){
        this.draw()
    }
    draw(){}
    isMouseOver(mouseX, mouseY) {
        return mouseX > this.pos.x && mouseX < this.pos.x + this.pos.w &&
               mouseY > this.pos.y && mouseY < this.pos.y + this.pos.h;
    }
    resize(){
        this.spos = this.pos.clone()
        this.prevpos = this.pos.clone()
    }
}

class DraggableItem extends Item{
    constructor(x,y,w,h,kind,clickAction=-1) {
        super(x,y,w,h,kind,clickAction>=0?0:1)
        // drag item 
        // show shadow hidden
        this.sh = 0

        // show drag item 
        this.ds = 0
        this.canDrag = 0

        // click btn
        // 0 home , 1 back  2 forward 3 array back 4 array next 5 show move 6 show drag item
        this.clickAction = clickAction

        this.drawImg = clickAction==-1?Img.tiles:Img.clickTiles
    }

    shift(value){
        if(this.ds)return;
        const {x,y} = GameBoardInit.CurPos
        this.prevpos.x = x+this.pos.w  + this.pos.w *value
        this.pos.x = x+this.pos.w  + this.pos.w *value
    }
    draw(){

        canvasSave()
        
        this.clickAction==2?canvasAlpha(GameBoardInit.sound):0

        
        canvasDraw(this.drawImg[this.kind],this.pos)
        
        if(this.sh){
            canvasAlpha(.5)
            canvasDraw(this.drawImg[this.kind],this.spos)
        }

        canvasDraw(this.drawImg[this.kind],this.prevpos)
        canvasRestore()
        
    }

    stopDragging() {
        this.pos = this.prevpos.clone()
        this.spos = this.prevpos.clone()
        if(this.sh &&this.npos.inside(this.mapLength)){
            
            GameBoardInit.currentMap[this.npos.y][this.npos.x] = this.kind

            GameBoardInit.dragObject = GameBoardInit.dragObject.filter(e=>e!=this)

        }else{
            this.ds=0
            this.pos = this.prevpos.clone()
            this.spos = this.pos.clone()
        }
    }

    drag(mouseX, mouseY) {
        this.ds = 1
        if (this.isDragging) {
            this.pos.x = mouseX - this.pos.w / 2;
            this.pos.y = mouseY - this.pos.h / 2;
            this.inGridMap()
        }
    }

    inGridMap(){

        const curPos = GameBoardInit.CurPos

        const gridCheck = this.pos.clone().substract(curPos)

        gridCheck.x = floor(gridCheck.x / gridCheck.w)
        gridCheck.y = floor(gridCheck.y / gridCheck.h)

        if(gridCheck.inside(this.mapLength)){

            if(GameBoardInit.currentMap[gridCheck.y][gridCheck.x]==0){
                this.spos.set(gridCheck.clone().dotwh().add(curPos))
                this.npos.set(gridCheck)
            }
            // shadmow
            this.sh = true
        }else{
            this.sh = false
        }
    }
}

class Hint extends Item{
    constructor(x,y,w,h,kind,player){
        super(x,y,w,h,kind)
        
        //this.timer = new Timer(0,.3,.001,1)
        this.show = 1

        this.player = player
        
    }
    update(player){
        this.player = player
        this.pos = player.pos.clone().add(
            this.npos.clone().dot(player.pos.w)
        )
        //this.pos = player.pos.clone().add(this.npos.clone().dot(player.pos.w))
        this.draw()
    }
    draw(){

        canvasSave()
        ctx.fillStyle = "#888"
        if(1){

            this.dtimer.start()
            ctx.globalAlpha = .3
            //ctx.fillRect(this.pos.x,this.pos.y,this.pos.w,this.pos.h)
            let i = 4 * (this.dtimer.progress>0.5?0:1) 

            canvasDraw(Img.clickTiles[this.kind+7+i],this.pos)
        }
        canvasRestore()
    }
}

class Plug extends Item{
    constructor(x,y,w,h,tap){
        super(x,y,w,h,1)
        // draw pos
        this.vpos = new Vector()

        this.ppos = new Vector()

        this.tap = tap
        

        // type of rect
        this.kind = 1
        
        // direction
        this.direction = 1

        this.mapping =  [-3,  3,2, -2].reduce((e, v, i) => (e[v] = i, e), {});
        // console.log(this.mapping)
        this.mapping1 = [1,  -1,-2, 2].reduce((e, v, i) => (e[v] = i, e), {});
        // Animate and timer
        this.moving = 0

        // arrow hint
        this.arrowHint = []
        
        // moving set
        const z = [0, 0];
        this.arrows = [[1, 0], [-1, 0],  [0, -1],[0, 1]]
        const coordinates = [...Array(5).fill(z),...this.arrows, ...Array(6).fill(z)];
        this.moveset = coordinates.map(([x, y]) => ({ x, y }));
        
        this.arrows.forEach((e,i)=>{
            this.arrowHint.push(new Hint(e[0],e[1],w,h,i+5,this))
        })

    }
    update(s){

        // arrow hint 
        let tempDirection = 17

        if(this.vpos.equal(this.moveset[0])&&this.direction>=9){
            
            if(this.tap<=0&&!this.moving){

                if(!GameBoardInit.trans.e){
                    GameBoardInit.trans.et = new TransitionEffect(this,GameBoardInit.fadeOut)
                    play(3)
                }
                
                this.arrowHint = []
                return;
            }else{
                if(this.tap==0)this.arrowHint=[];
                this.arrowHint.forEach(e=>{
                    const tempPos = this.npos.clone().add(e.npos)

                    if(tempPos.inside(this.mapLength)){
                       
                        if(GameBoardInit.currentMap[tempPos.y][tempPos.x]<=8){
                            
                            e.show=1
                            e.update(this)
                        }
                    }else{
                        e.show=0
                    }
                })
            }
        }

        if(this.direction>=4&&this.direction<=8){
            this.vpos.set(this.moveset[this.direction])
            if(this.direction>=5){
                this.cd = this.direction 
            }
        }

        const tempPos = this.npos.clone()
        tempPos.add(this.vpos)

        if(tempPos.inside(this.mapLength)){
            if(!this.moving){
                const temp = GameBoardInit.currentMap[tempPos.y][tempPos.x]
                if(temp<=8){
                    this.ppos = this.npos.clone()
                    this.npos = tempPos.clone()

                    // start moving
                    this.moving = 1

                }else{
                    // corner is save place
                    if((temp==11||temp==16||temp==18)&&!this.vpos.equal(this.moveset[0])){
                        this.tap = 0
                        play(3)
                    }

                    if(temp==10){
                        GameBoardInit.currentMap[tempPos.y][tempPos.x] = 0
                    }

                    this.vpos.zero()
                    this.direction = 9
                    
                    

                }
            }
        }else{
            this.direction = 9
            this.vpos.zero()
        }

        if(this.moving){
            
            const curPos = GameBoardInit.CurPos
            this.prevpos.set(this.npos.clone().dot(this.pos.w)).add(curPos)
            const progress = this.timer.progress
            this.pos.add(this.prevpos.clone().substract(this.pos).dot(progress))

            if(this.pd==this.cd){

                tempDirection = this.cd<=6?18:16

            }else{
                let tmp = this.mapping[this.pd-this.cd]
                if(this.pd==6||this.cd==6){
                    tmp = this.mapping1[this.pd-this.cd]
                }

                tempDirection = 12 + tmp
            }

            GameBoardInit.currentMap[this.ppos.y][this.ppos.x] = tempDirection?tempDirection:17

            if(this.timer.start()){
                
                this.direction = GameBoardInit.currentMap[this.npos.y][this.npos.x]
                
                this.pd = this.cd

                GameBoardInit.currentMap[this.npos.y][this.npos.x] = tempDirection?tempDirection:17

                if(this.direction==4){
                    GameBoardInit.currentMap = GameBoardInit.currentMap.map((row, j) =>
                        row.map((v, i) =>{
                            const va = LevelMap[GameBoardInit.level].map[j][i]
                            return va==4?0:va
                        }))
                }
               
                if(this.direction==3){
                    GameBoardInit.currentMap = GameBoardInit.currentMap.map(r=>r.map(v=>v==9?0:v))
                }


                if(this.direction==2){
                    this.vpos.zero()

                    play(2)
                    

                    if(!GameBoardInit.gm[GameBoardInit.level]){
                        GameBoardInit.emerge += floor(87/LevelMap.length)
                        localSet("bt",+GameBoardInit.emerge)
                    }

                    GameBoardInit.gm[GameBoardInit.level]=1
                    localSet("gm",JSON.stringify(GameBoardInit.gm))

                    GameBoardInit.level++
                    
                    GameBoardInit.trans.et = new TransitionEffect(this,GameBoardInit.fadeOut)
                }

                this.moving = 0
                this.timer.reset()
                this.pos.set(this.prevpos)
            }
        }
    }
    draw(){
        // temp size
        this.dtimer.start()

        ctx.save()
        //ctx.fillStyle = this.color 5678
        let i = 4 * (this.dtimer.progress>0.5? 0:1)
        canvasFillStyle(blueColor)
        canvasAlpha(.9)
        roundedRect(this.pos,10,0,0)
        // this.pd = this.cd
        canvasDraw(Img.player[this.cd-5+i],this.pos)
        //ctx.fillRect(this.pos.x,this.pos.y,this.pos.w,this.pos.h)
        ctx.restore()
        
    }
    resize(){
        const curPos = GameBoardInit.CurPos
        const grid = GameBoardInit.grid
        this.pos.setwh(this.npos.clone().dot(grid).add(curPos),grid)
    }
}

class MenuItem extends Item {
    constructor(x,y,w,h,kind) {
        super(x,y,w,h,kind)
        this.checked = false
        this.isHovered = false
    }
    draw() {
        canvasSave()
        let hoverColor = blueColor

        if(GameBoardInit.gm[this.kind]){
            hoverColor = '549688'
        }

        canvasFillStyle(this.isHovered ? '549688' : darkbule)

        roundedRect(this.pos.clone().add({x:5,y:5}),1,1)

        canvasFillStyle(this.isHovered ? '388E3C' : hoverColor)

        roundedRect(this.pos,1,1,10)

        const tempPos = this.pos.clone()

        tempPos.w =this.pos.w/2 
        tempPos.h =this.pos.h/2 
        tempPos.x = this.pos.x+this.pos.w/4
        tempPos.y = this.pos.y+this.pos.h/4

        canvasDraw(Img.tiles[max(1,this.kind%Img.tiles.length)],tempPos)

        canvasRestore()
    }
    updateHover(x,y){

        this.isHovered = this.isMouseOver(x,y)
    }
}

class Menu {
    constructor(map) {
        this.menuItems = [];

       
        const itemSize = GameBoardInit.menuItemSize 

        map.forEach((_, index) => {
            const row = floor(index / 4);
            const col = index % 4;
            const x = GameBoardInit.cw-(2.2*itemSize.x)+ col * (itemSize.x)*1.2;
            const y = GameBoardInit.ch-(3.2*itemSize.y) + row * (itemSize.y)*1.2;
            this.menuItems.push(new MenuItem(x, y, itemSize.x, itemSize.y, index));
        });

    }
    update(s){
        this.menuItems.forEach(e=>e.draw())
    }

    handleClick(x,y) {
        this.menuItems.forEach(item => {
            if (item.isMouseOver(x, y)) {
                GameBoardInit.RME([0,0,0])
                GameBoardInit.level = item.kind
                
                // cancel animate Go to select level
                GameBoardInit.trans.et = new TransitionEffect(GameBoardInit.player,GameBoardInit.fadeOut)
                GameBoardInit.trans.et.isRunning=0
            }
        });
    }

    handleMouseMove(x,y) {
        
        this.menuItems.forEach(item => {
            //console.log(item)
            item.updateHover(x, y);
        });
    }
}

export { 
    DraggableItem, 
    Plug,
    Menu
}