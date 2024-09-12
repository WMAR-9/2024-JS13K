import { min } from "./basic";
class Timer {
    constructor(startTime = 1, endTime = 1, step = 1,loop=0) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.step = step;
        this.loop = loop
    }

    set(startTime, endTime, step) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.step = step;
    }

    add() {
        this.startTime += this.step;
    }
    
    sub() {
        this.startTime -= this.step;
    }

    reset() {
        this.startTime = 0;
    }
    start() {
        if (this.startTime < this.endTime) {
            this.add();
            return 0
        } else {
            if(this.loop){
                this.reset();
            }
            return 1
        }
    }
    // animate
    get progress() {
        return min(this.startTime / this.endTime, 1);
    }
}


export { Timer }