import { blueColor, canvasAlpha, canvasBegin, canvasDraw, canvasFill, canvasFillStyle, canvasRestore, canvasSave, ctx, darkbule, Img, PowerDraw } from "../basic/setup.js";
import { distance, max, min, rand, randInt } from "../basic/basic.js";
import { GameBoardInit,roundedRect } from "../basic/setup.js";
import { Vector } from "./vector.js";
import { Timer } from "../basic/timer.js";

class Particle{
    constructor(count){

        this.pill = []
        this.connections = []
        this.mainHue = rand(360);

        for (let i = 0; i < count; i++) {
            this.pill.push({
                x: rand(GameBoardInit.mw),
                y: rand(GameBoardInit.mh),
                size: rand(3) +2,
                speedX: rand(1)-.5,
                speedY: rand(1)-.5,
                hue: this.mainHue + rand(60) - 30
            });
        }
    }
    update(s){
        
        this.pill.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Ensure particles stay within the canvas
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;

            particle.hue = this.mainHue + rand(60) - 30;

        });
        this.connects(s)
        this.draw()
    }
    draw(){
        ctx.save()
        this.pill.forEach((particle, index) => {
            //const opacity = 1 - (index / particleCount);
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `#bbb`;
            ctx.fill();
        });

        this.connections.forEach(conn => {
            const gradient = ctx.createLinearGradient(conn.x1, conn.y1, conn.x2, conn.y2);
            gradient.addColorStop(0, `hsla(${conn.hue}, 70%, 60%, ${conn.alpha * 0.5})`);
            gradient.addColorStop(0.3, `hsla(${conn.hue}, 100%, 80%, ${conn.alpha})`);
            gradient.addColorStop(1, `hsla(${conn.hue}, 70%, 60%, ${conn.alpha * 0.5})`);
            
            // const gradient = "#333"
            ctx.beginPath();
            ctx.moveTo(conn.x1, conn.y1);
            ctx.lineTo(conn.x2, conn.y2);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2 * conn.alpha;
            ctx.stroke();


            if (rand(1) < 0.05) {
                ctx.beginPath();
                ctx.moveTo(conn.x1, conn.y1);
                const midX = (conn.x1 + conn.x2) / 2 + rand(20)*rand(.5);
                const midY = (conn.y1 + conn.y2) / 2 + rand(20)*rand(.5);
                ctx.quadraticCurveTo(midX, midY, conn.x2, conn.y2);
                ctx.strokeStyle = `hsla(${conn.hue}, 100%, 80%, ${conn.alpha})`;
                ctx.lineWidth = 3 * conn.alpha;
                ctx.stroke();
            }
        });
        ctx.restore()
    }
    connects(s){

        this.connections = []

        let particles = this.pill
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = distance(particles[i],particles[j]);
                if (dist < 100) {
                    this.connections.push({
                        x1: particles[i].x,
                        y1: particles[i].y,
                        x2: particles[j].x,
                        y2: particles[j].y,
                        alpha: 1 - dist / 100,
                        hue: (particles[i].hue + particles[j].hue) / 2
                    });
                }
            }
        }

    }
}

class Letter {
    constructor(str,moveY=0,waveY=0) {
        
        this.moveY = moveY
        this.waveY = waveY

        str = str.split('\n')
        
        let letterSpaceing = min(GameBoardInit.grid,50),maxi=0
        let baseY = GameBoardInit.ch-str.length*letterSpaceing/2
        
        this.char = str.flatMap((line, i) => {
            maxi = max(maxi, line.length)
            return line.split('').map((char, j) => ({
                pos:new Vector(0,
                    baseY + letterSpaceing * i*1.3,
                    letterSpaceing,
                    letterSpaceing
                ),
                vpos:new Vector(i,j),
                c: char,
                size: letterSpaceing,
            }))
        })
        this.x = GameBoardInit.cw - ( letterSpaceing * maxi ) /2

        this.pos = new Vector(this.x,baseY-letterSpaceing*max(this.waveY,2)/2,letterSpaceing * maxi,(letterSpaceing+15)*(str.length+max(this.waveY,1)))
        
        
    }

    update(s) {
        canvasSave()
        canvasFillStyle(darkbule)
        roundedRect(this.pos.clone().add({x:5,y:5}),1,0,15)
        canvasFillStyle(blueColor)
        roundedRect(this.pos,1,1,15)
        
        this.char.forEach((e,i)=>{
            e.pos.y = e.pos.y + Math.sin(Date.now() * .01 + i * this.moveY) * this.waveY;
            e.pos.x = this.x  + e.size * e.vpos.y
            canvasDraw(Img.A2ZTile[e.c],e.pos.clone().dot(1.01))
            canvasDraw(Img.ATB[e.c],e.pos)
        })
        
        canvasRestore()

    }
}

class UIStartView extends Letter{
    constructor(str) {
        super(str)
        
        

        this.timer = new Timer(0,100)
        
        this.dtimer = new Timer(0,2,.01)
        
        this.reverse = 1

        this.trigger = 0

        let letterSpaceing = min(GameBoardInit.grid,50)

        this.x = GameBoardInit.cw - ( letterSpaceing *str.length) /2

        str = str.split('\n')

        this.char = str.flatMap((line, i) => {
            return line.split('').map((char, j) => ({
                pos: new Vector(rand(GameBoardInit.mw),rand(GameBoardInit.mh)),
                epos: new Vector(this.x + letterSpaceing * j,GameBoardInit.ch + letterSpaceing * i),
                spos: new Vector(rand(GameBoardInit.mw),rand(GameBoardInit.mh)),
                c: char,
                size: letterSpaceing,
                opacity:1
            }))
        })
        
        this.rains = []
        
        for (let i = 0; i < 50; i++) {
            this.rains.push({
                x : rand(GameBoardInit.mw),
                y : rand(GameBoardInit.mh),
                length : rand(20)+10,
                speed : rand(5)+2,
                opacity : rand(.5) + .2,
            });
        }

        this.rainDrops = []
    }

    update(s) {


        // rain 
        canvasSave()
        this.rains.forEach(e=>{
            e.y += e.speed;
            if (e.y > canvas.height) {
                e.y = -e.length;
                e.x = Math.random() * canvas.width;
            }
            ctx.strokeStyle = `rgba(255, 255, 255, ${e.opacity})`;
            ctx.lineWidth = 2;
            canvasBegin()
            ctx.moveTo(e.x, e.y);
            ctx.lineTo(e.x, e.y + e.length);
            ctx.stroke();
        })
        
        let grid = GameBoardInit.grid+15
        

        if (this.reverse) {
            this.dtimer.add()
            if (this.dtimer.progress >= .7) {
                this.reverse = 0;
            }
        } else {
            this.dtimer.sub()
            if (this.dtimer.progress < 0) {
                this.reverse = 1; 
            }
        }
        
        canvasAlpha(max(this.dtimer.progress,0))
        PowerDraw(this.x,GameBoardInit.ch-grid,grid*3,grid-15)
        canvasFillStyle("e61c5d")
        ctx.fillRect(0, 0, GameBoardInit.mw,GameBoardInit.mh);

        

        canvasRestore()

        canvasSave()
        canvasFillStyle("880")
        roundedRect({x:this.x,y:GameBoardInit.ch-grid,w:grid/4,h:grid-15})

        this.char.forEach((e, i) => {
            e.pos.setwh(e.pos,min(GameBoardInit.grid,50))
            // If scattering, move toward the scatter positions and fade out
            if (this.trigger) {
                
                e.pos.add(e.spos.clone().substract(e.pos).dot(.02))
                e.opacity = max(e.opacity-=0.01, 0) // Ensure opacity doesn't go negative
            } else {
                // Move back toward the original center positions
                e.pos.add(e.epos.clone().substract(e.pos).dot(.02))
                e.opacity = Math.min(e.opacity, 1)
            }

            // Draw letters with opacity
            canvasAlpha(e.opacity)
            
            canvasDraw(Img.A2ZTile[e.c],e.pos.clone().dot(1.13))
            canvasDraw(Img.ATB[e.c],e.pos)
        });

        canvasRestore()
        // Increment scatter counter
        if (this.trigger) {
            if (this.timer.start()) {
                GameBoardInit.RME([0,1,0])
            }
        }
    }
}




export { Particle,Letter,UIStartView}