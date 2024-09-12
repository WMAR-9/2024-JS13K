import { min,max } from '../basic/basic.js'
import { canvas,ctx } from '../basic/setup.js';
import { Timer } from '../basic/timer.js'

const easeOutQuad=t=>{
    return t * (2 - t);
}

class TransitionEffect {
    constructor(foregroundObject,fadeIn=false, duration = 3000) {
        this.foreground = foregroundObject.pos;
        this.backgroundColor = '#000';
        this.duration = duration;
        this.timer = new Timer(0, duration, 32); // 假設每幀16毫秒
        this.maxRadius = max(canvas.width, canvas.height);
        this.minRadius = .5;
        this.isRunning = true;
        this.fadeIn = fadeIn; // 預設為淡入效果
    }
    update(){
        if (!this.isRunning) return;

        const progress = this.timer.progress;

        const easedProgress = easeOutQuad(progress);

        let radius;

        if (this.fadeIn) {
            radius = min(this.minRadius + easedProgress * (this.maxRadius - this.minRadius), this.maxRadius);
        } else {
            radius = this.maxRadius - easedProgress * (this.maxRadius - this.minRadius);
        }

        ctx.save();
        
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();

        ctx.arc(
            this.foreground.x + this.foreground.w / 2,
            this.foreground.y + this.foreground.h / 2,
            radius, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        this.timer.add();
        // stop this timer
        if (progress >= 1) {
            this.isRunning = false;
        }
    }

}



export { TransitionEffect,easeOutQuad}