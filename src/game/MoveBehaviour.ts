import { Behaviour, Transform } from "../gameengine";

export class MoveBehaviour extends Behaviour {

    duration:number = 500;

    targetY:number = 0;

    private duringTime = 0;

    private startY:number = 0;

    onStart(){
        const transform = this.displayObject.getScript(Transform);
        this.startY =  transform.y;
    }

    onUpdate(advancedTime:number){

        function ease(x:number){
            return -(x -1)*(x-1) + 1;
        }

        this.duringTime += advancedTime;

        let timeRate = this.duringTime / this.duration;
       
        if (timeRate > 1) {
            timeRate = 1;
        }
        timeRate = ease(timeRate)
        const transform = this.displayObject.getScript(Transform);
        transform.y = this.targetY * timeRate + this.startY;

        if (timeRate >= 1){
            this.displayObject.removeScript(this);
        }
    }
}